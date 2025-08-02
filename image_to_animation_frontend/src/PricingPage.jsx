import React from "react";
import "./design-system.css";

/*
  PUBLIC_INTERFACE
  PricingPage: Displays the pricing headline, pricing table (with Features, Free, Premium, and Enterprise columns),
  and modern Kavia AI theming/appearance, matching the design outlined in /assets/pricing.html and the Figma asset.

  The layout is responsive, visually rich, and feature-complete for demo/marketing purposes.
*/
function PricingPage() {
  return (
    <div className="pricing-bg" style={{
      background: "var(--color-231f20)", minHeight: "100vh", width: "100vw", overflowX: "hidden"
    }}>
      {/* Optional header placeholder */}
      <div className="pricing-header" style={{
        width: "100%", height: 70, background: "var(--color-231f20)",
        boxShadow: "0 1.5px 6px #00000036", position: "sticky", top: 0, zIndex: 11
      }}>
        {/* Could place logo/nav here */}
      </div>
      <div className="pricing-ellipse"
        style={{
          position: "absolute", left: 550, top: 280, width: 1095, height: 514,
          borderRadius: "50%", background: "var(--color-f26a1b)", opacity: 0.35, zIndex: 1,
          pointerEvents: "none"
        }}
      />

      <main className="pricing-sheet" style={{ position: "relative", maxWidth: 1256, margin: "0 auto", marginBottom: 60, padding: "0 16px", zIndex: 2 }}>
        <section style={{ paddingTop: 60, textAlign: "center" }}>
          <h1 className="typo-291" style={{
            marginBottom: 14, color: "var(--color-ffffff)", fontSize: 48, fontWeight: 600, letterSpacing: 0,
          }}>Pricing</h1>
          <p className="typo-293" style={{ marginBottom: 34, maxWidth: 680, marginLeft: "auto", marginRight: "auto" }}>
            KAVIA AI pricing plans for teams of all sizes. Choose an affordable plan that's packed with the best features for you.
          </p>
          <div className="pricing-table" style={{
            display: "flex", flexDirection: "row", width: "100%", background: "var(--color-231f20)",
            borderRadius: "var(--radius-13)", boxShadow: "0 2px 12px 0 #00000030", margin: "55px 0 20px 0", overflow: "hidden"
          }}>
            {/* Column 1: Features */}
            <div className="pricing-col" style={{
              flex: 1, minWidth: 220, borderRight: "1px solid var(--color-dedcdd)",
              padding: "0 0 24px 0", background: "var(--color-231f20)", textAlign: "left"
            }}>
              <div style={{ fontSize: 24, fontWeight: 400, margin: "36px 0 8px 0", color: "var(--color-b3b3b3)", textAlign: "center" }}>
                Features
              </div>
              <div className="pricing-plan-desc" style={{
                color: "var(--color-dedcdd)", fontSize: 15, textAlign: "center", marginBottom: 18
              }}>Best for Individual with Advanced Features</div>
              <ul className="pricing-featlist" style={{
                marginTop: 28, marginBottom: 8, listStyle: "none", padding: "0 18px 0 32px"
              }}>
                <li>Create Web/Mobile Application</li>
                <li>Figma Design Import</li>
                <li>One Click Deployment</li>
                <li>External Integrations</li>
                <li>Query Public Codebase</li>
                <li>Private Projects</li>
                <li>Integrate with GitHub</li>
                <li>Plan and Build Scalable Projects</li>
                <li>Ingest &amp; Modify Existing Codebase</li>
                <li>Multi-User Collaboration</li>
                <li>Organization GitHub Access</li>
                <li>Team Based Access Control</li>
                <li>Custom/Enterprise Support</li>
                <li>Custom LLM and Workflow Configurations</li>
                <li>Custom AWS Deployment</li>
              </ul>
            </div>

            {/* Column 2: Free Plan */}
            <div className="pricing-col" style={{
              position: "relative", flex: 1, minWidth: 220, background: "var(--color-231f20)"
            }}>
              <div className="rec-badge" style={{
                position: "absolute", left: "50%", top: 24, transform: "translateX(-50%)",
                background: "var(--color-ffefe4)", color: "var(--color-e15e0d)", padding: "5px 22px 4px 22px",
                borderRadius: "var(--radius-12)", fontSize: 13, fontWeight: 600, letterSpacing: ".7px", zIndex: 10, boxShadow: "0 2px 5px #ffefe417"
              }}>
                Recommended
              </div>
              <div className="pricing-plan-title" style={{
                textAlign: "center", fontSize: 26, fontWeight: 500, margin: "36px 0 8px 0", color: "var(--color-ffffff)"
              }}>Free</div>
              <div className="pricing-plan-desc" style={{
                textAlign: "center", fontSize: 15, color: "var(--color-dedcdd)", marginBottom: 18
              }}>Best for getting started</div>
              <div className="pricing-price-big" style={{
                fontSize: 27, fontWeight: 600, color: "var(--color-f26a1b)", textAlign: "center", margin: "18px 0 0 0"
              }}>50,000</div>
              <div className="pricing-credits" style={{
                color: "var(--color-b3b3b3)", textAlign: "center", fontSize: 14, marginBottom: 10
              }}>Credits / month</div>
              <ul className="pricing-featlist" style={{ marginTop: 10, marginBottom: 8, textAlign: "left" }}>
                <li><b>$0</b> per month</li>
                <li><b>All individual builder features</b></li>
                <li style={{ fontSize: 13, opacity: 0.65 }}>No Custom LLM/Enterprise/Team features</li>
              </ul>
              <button className="pricing-plan-cta" style={{
                display: "block", fontSize: 15, fontWeight: 700, padding: "13px 0",
                margin: "30px auto 8px auto", width: "84%", borderRadius: "var(--radius-6)", border: "none",
                background: "var(--color-f26a1b)", color: "#fff", letterSpacing: ".05em", cursor: "pointer",
                boxShadow: "0 2px 10px #e15e0d22", transition: "filter 0.13s"
              }}>
                Get Started for Free
              </button>
            </div>

            {/* Column 3: Premium */}
            <div className="pricing-col" style={{
              flex: 1, minWidth: 220, background: "var(--color-231f20)"
            }}>
              <div className="pricing-plan-title" style={{
                textAlign: "center", fontSize: 26, fontWeight: 500, margin: "36px 0 8px 0", color: "var(--color-ffffff)"
              }}>Premium</div>
              <div className="pricing-plan-desc" style={{
                textAlign: "center", fontSize: 15, color: "var(--color-dedcdd)", marginBottom: 18
              }}>Grow without limits</div>
              <div className="pricing-price-big" style={{
                fontSize: 27, fontWeight: 600, color: "var(--color-f26a1b)", textAlign: "center", margin: "18px 0 0 0"
              }}>550,000</div>
              <div className="pricing-credits" style={{
                color: "var(--color-b3b3b3)", textAlign: "center", fontSize: 14, marginBottom: 10
              }}>Credits / month</div>
              <ul className="pricing-featlist" style={{ marginTop: 10, marginBottom: 8, textAlign: "left" }}>
                <li><b>$20</b> per month</li>
                <li>All Free features</li>
                <li>Priority Support</li>
                <li>Enterprise/Team option: <b>$50, $100/mo</b></li>
              </ul>
              <button className="pricing-plan-cta" style={{
                display: "block", fontSize: 15, fontWeight: 700, padding: "13px 0",
                margin: "30px auto 8px auto", width: "84%", borderRadius: "var(--radius-6)", border: "none",
                background: "var(--color-f26a1b)", color: "#fff", letterSpacing: ".05em", cursor: "pointer",
                boxShadow: "0 2px 10px #e15e0d22", transition: "filter 0.13s"
              }}>
                Upgrade to Premium
              </button>
            </div>

            {/* Column 4: Enterprise */}
            <div className="pricing-col" style={{
              flex: 1, minWidth: 220, background: "var(--color-231f20)"
            }}>
              <div className="pricing-plan-title" style={{
                textAlign: "center", fontSize: 26, fontWeight: 500, margin: "36px 0 8px 0", color: "var(--color-ffffff)"
              }}>Contact for Enterprise</div>
              <div className="pricing-plan-desc" style={{
                textAlign: "center", fontSize: 13, color: "var(--color-dedcdd)", marginBottom: 18
              }}>Advanced features and volume pricing for teams</div>
              <div className="pricing-price-big" style={{
                fontSize: 27, fontWeight: 600, color: "var(--color-f26a1b)", textAlign: "center", margin: "18px 0 0 0"
              }}>Custom</div>
              <div className="pricing-credits" style={{
                color: "var(--color-b3b3b3)", textAlign: "center", fontSize: 14, marginBottom: 10
              }}>Contact Us</div>
              <ul className="pricing-featlist" style={{ marginTop: 10, marginBottom: 8, textAlign: "left" }}>
                <li>All Premium features</li>
                <li>Team & workflow governance</li>
                <li>Custom support, integrations, security</li>
              </ul>
              <button className="pricing-plan-cta" style={{
                display: "block", fontSize: 15, fontWeight: 700, padding: "13px 0",
                margin: "30px auto 8px auto", width: "84%", borderRadius: "var(--radius-6)", border: "none",
                background: "var(--color-f26a1b)", color: "#fff", letterSpacing: ".05em", cursor: "pointer",
                boxShadow: "0 2px 10px #e15e0d22", transition: "filter 0.13s"
              }}>
                Contact Us
              </button>
            </div>
          </div>
          {/* Help link area */}
          <div className="help-link" style={{ margin: "24px auto 0 auto", textAlign: "center", color: "var(--color-4997b3)", fontSize: 15, textDecoration: "underline dotted", fontWeight: 500, cursor: "pointer" }}>
            More questions? Let us help. <b>Contact us</b>.
          </div>
        </section>
      </main>
      <footer className="pricing-footer" style={{
        marginTop: "5vh", width: "100vw",
        padding: "60px 0 32px 0", background: "var(--color-161314)",
        color: "var(--color-dedcdd)", borderRadius: "var(--radius-40) var(--radius-40) 0 0",
        position: "relative"
      }}>
        <div style={{ width: "100%", textAlign: "center" }}>
          <span style={{ fontSize: 15, color: "var(--color-b3b3b3)" }}>© 2025 KAVIA AI - All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}

export default PricingPage;
