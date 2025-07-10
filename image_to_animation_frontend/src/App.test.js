import React from "react";
import { render, screen, fireEvent, within, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

/**
 * Helper to create a mock File object
 */
function createMockImageFile(name = "image.png", type = "image/png", size = 1111) {
  const file = new File(["(image content)"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
}

describe("Image Animation Creator App", () => {
  // --- Upload feature ---
  test("allows user to upload multiple image files via file selector", async () => {
    render(<App />);
    const uploadBtn = screen.getByRole("button", { name: /upload images/i });

    // Open file dialog and upload two files
    const fileInput = screen.getByLabelText("Upload Images", { selector: "input[type='file']" }) || 
      document.querySelector("input[type='file']");

    // Simulate the user clicking the upload button
    await act(async () => {
      fireEvent.click(uploadBtn);
    });

    const imgFiles = [
      createMockImageFile("img1.png"),
      createMockImageFile("img2.jpg", "image/jpeg"),
    ];

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: imgFiles } });
    });

    // Confirm thumbnails rendered for uploaded images
    expect(screen.getAllByRole("img", { name: /thumbnail/i })).toHaveLength(2);

    // Thumbnails should display correct label
    expect(screen.getByLabelText(/image 1: img1.png/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image 2: img2.jpg/i)).toBeInTheDocument();
  });

  test("shows error if uploading non-image files", async () => {
    render(<App />);
    const fileInput = screen.getByLabelText("Upload Images", { selector: "input[type='file']" }) || 
      document.querySelector("input[type='file']");
    // Mock PDF file
    const file = new File(["foo"], "foo.pdf", { type: "application/pdf" });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(screen.getByRole("alert")).toHaveTextContent(/please upload image files only/i);
  });

  test("user can drag-and-drop upload images", async () => {
    render(<App />);
    const dropzone = screen.getByRole("img", { hidden: true }) || 
      screen.getByRole("region", { name: /drag-and-drop/i }) || 
      document.querySelector(".iac-dropzone");

    const imgFiles = [
      createMockImageFile("x.png"),
      createMockImageFile("y.png"),
    ];

    // Simulate drag/drop event
    await act(async () => {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: imgFiles,
          items: [],
        },
        preventDefault: () => {},
      });
    });
    expect(screen.getAllByRole("img", { name: /thumbnail/i })).toHaveLength(2);
  });

  // --- Arrangement (Drag & Drop) ---
  test("allows rearrangement of images via drag-and-drop", async () => {
    render(<App />);
    // Upload three images
    const fileInput = document.querySelector("input[type='file']");
    const imgs = [
      createMockImageFile("1.jpg"),
      createMockImageFile("2.jpg"),
      createMockImageFile("3.jpg"),
    ];
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: imgs } });
    });

    // Get all thumbnails
    const thumbs = screen.getAllByRole("img", { name: /thumbnail/i });
    expect(thumbs).toHaveLength(3);

    // Simulate drag image 1 and drop on image 3: [1,2,3] => [2,3,1]
    const imgThumbs = document.querySelectorAll(".img-thumb");

    await act(async () => {
      fireEvent.dragStart(imgThumbs[0]);
      fireEvent.dragOver(imgThumbs[2]);
      fireEvent.drop(imgThumbs[2]);
    });

    // After rearrange, "Image 1" should now be at the 3rd position
    const reordered = Array.from(document.querySelectorAll(".img-thumb img"));
    expect(reordered[2]).toHaveAttribute("alt", "thumbnail-0");
  });

  test("allows removal of images, updates grid and disables GIF if <2 images", async () => {
    render(<App />);
    const fileInput = document.querySelector("input[type='file']");
    const imgs = [createMockImageFile("foo.jpg"), createMockImageFile("bar.jpg")];
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: imgs } });
    });
    expect(screen.getAllByRole("img", { name: /thumbnail/i })).toHaveLength(2);

    // Click "remove" on first
    const removeBtn = screen.getAllByLabelText("Remove")[0];
    await act(async () => {
      userEvent.click(removeBtn);
    });
    // One image remains, GIF preview should show minimum warning
    expect(screen.getAllByRole("img", { name: /thumbnail/i })).toHaveLength(1);
    expect(screen.getByText(/upload at least 2 images/i)).toBeInTheDocument();
  });

  // --- Animation speed selection ---
  test("slider can be adjusted and reflects value", async () => {
    render(<App />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveValue("500");
    // Change value
    await act(async () => {
      fireEvent.change(slider, { target: { value: "2000" } });
    });
    expect(slider).toHaveValue("2000");
    expect(screen.getByText(/2000/i)).toBeInTheDocument();
  });

  // --- Animation preview logic ---
  test("shows preview with fallback animation when min images present", async () => {
    render(<App />);
    const fileInput = document.querySelector("input[type='file']");
    const imgs = [createMockImageFile("a.jpg"), createMockImageFile("b.jpg")];
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: imgs } });
    });

    expect(screen.getByText(/preview & download/i)).toBeInTheDocument();
    // Should NOT show: Download GIF (not generated yet)
    expect(screen.queryByRole("button", { name: /download gif/i })).not.toBeInTheDocument();
    // Fallback preview present
    expect(screen.getByAltText(/frame 1/i)).toBeInTheDocument();
  });

  // --- GIF Generation & Download ---
  test("Create GIF button is disabled when <2 images, enabled otherwise", async () => {
    render(<App />);
    const btn = screen.getByRole("button", { name: /create gif/i });
    expect(btn).toBeDisabled();

    const fileInput = document.querySelector("input[type='file']");
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [createMockImageFile("one.jpg")] } });
    });
    expect(btn).toBeDisabled();

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [createMockImageFile("two.jpg")] } });
    });
    // Should be enabled now
    expect(btn).not.toBeDisabled();
  });

  test("shows error if user tries to generate GIF with <2 images", async () => {
    render(<App />);
    // Only one image
    const fileInput = document.querySelector("input[type='file']");
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [createMockImageFile("solo.jpg")] } });
    });
    const btn = screen.getByRole("button", { name: /create gif/i });
    await act(async () => {
      userEvent.click(btn);
    });
    expect(screen.getByRole("alert")).toHaveTextContent(/upload at least 2 images/i);
  });

  test("handles GIF creation error gracefully", async () => {
    // Mock window.GIF to throw
    global.window.GIF = jest.fn(() => { throw new Error("oops"); });
    render(<App />);
    const fileInput = document.querySelector("input[type='file']");
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [createMockImageFile(), createMockImageFile()] } });
    });
    const btn = screen.getByRole("button", { name: /create gif/i });
    await act(async () => {
      userEvent.click(btn);
    });
    expect(await screen.findByRole("alert")).toHaveTextContent(/failed to generate gif/i);
    // Clean up static window.GIF
    delete global.window.GIF;
  });

  // --- Download: User can download generated GIF ---
  test("download button triggers download when GIF generated (mock gif.js)", async () => {
    // Create a Blob URL and mock GIF "finished" event
    render(<App />);
    const fileInput = document.querySelector("input[type='file']");
    const imgs = [createMockImageFile(), createMockImageFile()];
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: imgs } });
    });

    // Mock gif.js workflow: patch window.GIF to a jest class that triggers finished
    const mockBlobUrl = "blob:mock-gif-url";
    global.URL.createObjectURL = jest.fn(() => mockBlobUrl);

    // Minimal GIF mock
    class MockGIF {
      constructor() { this._handlers = {}; }
      on(ev, cb) { this._handlers[ev] = cb; }
      addFrame() {}
      render() { setTimeout(() => { this._handlers["finished"] && this._handlers["finished"](new Blob()); }, 0); }
    }
    global.window.GIF = MockGIF;

    // Trigger GIF creation
    const btn = screen.getByRole("button", { name: /create gif/i });
    await act(async () => {
      userEvent.click(btn);
    });

    // Wait for mock GIF to appear in preview & Download button to show
    await waitFor(() =>
      expect(screen.getByRole("img", { name: /animated gif preview/i })).toBeInTheDocument()
    );
    const downloadBtn = screen.getByRole("button", { name: /download gif/i });
    expect(downloadBtn).toBeInTheDocument();

    // Spy on anchor click
    const clickSpy = jest.spyOn(document, "createElement");
    await act(async () => {
      userEvent.click(downloadBtn);
    });
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    clickSpy.mockRestore();
    delete global.window.GIF;
  });

  // --- Accessibility and Smoke Test ---
  test("main interface sections rendered, correct labels", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /image animation creator/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload images/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /arrange images/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /animation settings/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /preview & download/i })).toBeInTheDocument();
    expect(screen.getByText(/powered by/i)).toBeInTheDocument();
  });
});
