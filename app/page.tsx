import Link from "next/link";
import InteractiveSections from "./interactive-sections";
import { auth } from "@clerk/nextjs/server";

const features = [
  ["✓", "Trusted protection", "Practical legal support when it matters most."],
  ["♙", "Experienced attorneys", "Your matter is routed to the right legal professional."],
  ["▣", "Secure & private", "Your documents stay organized in one protected place."],
  ["◇", "Clear & transparent", "$529.88 for the first year, including a one-time $50 broker fee. Renews at $479.88 per year."],
];

export default async function Home() {
  const { userId } = await auth();
  return (
    <main>
      <section className="hero-shell">
        <header className="site-header">
          <Link href="/" className="brand">Pacifica Legal Insurance</Link>
          <nav aria-label="Main navigation">
            <a href="#coverage">Coverage</a><a href="#how">How it works</a><a href="#attorneys">Attorney Network</a><a href="#resources">Resources</a><a href="#about">About</a>
          </nav>
          <Link className="login-link" href="/portal">{userId ? "Member portal" : "Client login"}</Link>
        </header>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Legal support. Made simple.</p>
            <h1>Legal protection,<br/>handled with<br/>confidence.</h1>
            <span className="gold-rule" />
            <p className="lede">Expert legal support when you need it most.<br/>Clear coverage. Simple process. Total peace of mind.</p>
            <div className="hero-actions">
              {userId ? (
                <Link className="button button-gold" href="/portal">Go to member portal</Link>
              ) : (
                <>
                  <Link className="button button-gold" href="/portal">Create an account</Link>
                  <Link className="button button-outline" href="/portal">Client login</Link>
                </>
              )}
            </div>
          </div>

          <div className="public-assurance" aria-label="Pacifica service promise">
            <span className="assurance-mark">✦</span>
            <p>YOUR LEGAL PROTECTION</p>
            <h2>One account.<br/>One organized place<br/>for every legal matter.</h2>
            <ul><li>Submit a ticket or legal concern</li><li>Upload documents and photographs securely</li><li>Follow your case and payment status</li></ul>
            <small>Account information is only visible after secure sign-in.</small>
          </div>
        </div>
      </section>

      <section className="trust-strip" id="coverage">
        {features.map(([icon,title,text])=><article key={title}><span>{icon}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
      </section>

      <section className="how-section" id="how">
        <div><p className="eyebrow dark">Your coverage in action</p><h2>From legal trouble to<br/>the right help—quickly.</h2></div>
        <ol><li><b>01</b><span><strong>Tell us what happened</strong>Open a new matter from your account.</span></li><li><b>02</b><span><strong>Upload your documents</strong>Add tickets, notices, photos, and other evidence.</span></li><li><b>03</b><span><strong>We route your case</strong>Your team reviews everything and connects the right lawyer.</span></li></ol>
      </section>
      <InteractiveSections />
      <section className="attorney-network" id="attorneys">
        <div className="network-copy"><p className="eyebrow">Pacifica attorney network</p><h2>Help members.<br/>Grow your practice.</h2><p>Pacifica works with independent attorneys who want to receive organized, coverage-screened legal matters in the areas they choose to handle.</p><Link href="/attorney-network/apply" className="button button-gold">Apply to join the network</Link></div>
        <div className="network-benefits"><article><span>01</span><div><h3>Choose your practice areas</h3><p>Receive matters that align with your experience, licensing, and availability.</p></div></article><article><span>02</span><div><h3>Organized client intake</h3><p>Review the member’s description, deadlines, and uploaded documents in one secure place.</p></div></article><article><span>03</span><div><h3>Direct case communication</h3><p>Connect with assigned members and keep the Pacifica team informed of important status changes.</p></div></article><article><span>04</span><div><h3>Simplified administration</h3><p>Manage assignments and supporting records without chasing documents across separate inboxes.</p></div></article></div>
      </section>
      <section className="partner-band"><div><p className="eyebrow dark">Offer Pacifica</p><h2>Protection for your employees, members, or customers.</h2></div><div className="partner-options"><article><b>Employers</b><p>Add practical legal support to your employee benefits package.</p><a href="mailto:pacificalegalinsurance@gmail.com?subject=Employer%20Partnership">Explore employer plans →</a></article><article><b>Brokers</b><p>Offer a focused legal-protection option alongside other client benefits.</p><a href="mailto:pacificalegalinsurance@gmail.com?subject=Broker%20Partnership">Work with Pacifica →</a></article><article><b>Organizations</b><p>Create a tailored program for associations, membership groups, and partners.</p><a href="mailto:pacificalegalinsurance@gmail.com?subject=Organization%20Partnership">Discuss a partnership →</a></article></div></section>
      <section className="about-section" id="about">
        <div><p className="eyebrow dark">About Pacifica</p><h2>Legal protection built around real life.</h2></div>
        <div><p>Pacifica Legal Insurance was created to make everyday legal support easier to understand, access, and manage. Members have one organized place to submit a concern, upload important documents, follow their matter, and stay connected with the professionals handling it.</p><p>Our goal is simple: remove confusion from the legal process and help members take the next step with confidence. Coverage, limitations, deductibles, and attorney services are governed by the applicable membership agreement and plan documents.</p><Link href="/portal" className="text-link">Become a member →</Link></div>
      </section>
      <footer><div><Link href="/" className="brand">Pacifica Legal Insurance</Link><p>Legal protection, handled with confidence.</p></div><div><b>Explore</b><a href="#coverage">Coverage</a><a href="#attorneys">Attorney Network</a><a href="#resources">Resources</a><a href="#about">About</a></div><div><b>Members</b><Link href="/portal">Client login</Link><Link href="/portal">Submit a legal matter</Link></div><small>© 2026 Pacifica Legal Insurance. All rights reserved. Plan descriptions are illustrative and do not constitute a contract. Eligibility, coverage, deductibles, limitations, and exclusions are governed by the applicable membership agreement. Educational material is not legal advice.</small></footer>
    </main>
  );
}
