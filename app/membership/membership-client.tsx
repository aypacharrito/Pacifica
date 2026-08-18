"use client";
import { useState } from "react";
import LegalTerms, { TERMS_VERSION } from "../legal-terms";

export default function MembershipClient({ alreadyAccepted }: { alreadyAccepted: boolean }) {
  const [open, setOpen] = useState(!alreadyAccepted);
  const [checked, setChecked] = useState(false);
  const [accepted, setAccepted] = useState(alreadyAccepted);
  const [paymentOption, setPaymentOption] = useState<"annual" | "installments">("annual");
  function accept() { if (!checked) return; setAccepted(true); setOpen(false); }

  return <>
    <article className="enrollment-card payment-shell">
      <div className="payment-intro">
        <p className="eyebrow dark">12-MONTH MEMBERSHIP</p>
        <h1>Choose the plan that works for you</h1>
        <p>One year of Pacifica protection. Select one simple payment option below.</p>
      </div>
      <div className="payment-choice-grid" role="radiogroup" aria-label="Membership payment options">
        <label className={paymentOption === "annual" ? "payment-choice selected" : "payment-choice"}>
          <input type="radio" name="displayPaymentOption" checked={paymentOption === "annual"} onChange={() => setPaymentOption("annual")} />
          <span className="choice-check">✓</span><span className="choice-kicker">PAY ONCE</span><strong>Annual payment</strong>
          <span className="choice-price"><sup>$</sup>529<small>.88</small></span><span className="choice-detail">One secure payment today</span><span className="choice-note">No monthly billing</span>
        </label>
        <label className={paymentOption === "installments" ? "payment-choice selected" : "payment-choice"}>
          <input type="radio" name="displayPaymentOption" checked={paymentOption === "installments"} onChange={() => setPaymentOption("installments")} />
          <span className="choice-check">✓</span><span className="choice-kicker">PAY MONTHLY</span><strong>Monthly plan</strong>
          <span className="choice-price"><sup>$</sup>39<small>.99/mo</small></span><span className="choice-detail">Plus a one-time $50 enrollment fee</span><span className="choice-note">$89.99 today, then eleven payments of $39.99</span>
        </label>
      </div>
      <div className="payment-summary"><span>Selected today</span><strong>{paymentOption === "annual" ? "$529.88 paid in full" : "$89.99 initial payment"}</strong><small>{paymentOption === "annual" ? "Covers the complete 12-month term" : "$39.99 monthly for the following 11 months"}</small></div>
      {!accepted ? <button className="button button-gold payment-cta" onClick={() => setOpen(true)}>Review terms to continue</button> :
      <form action="/api/stripe/checkout" method="post" className="checkout-form">
        <input type="hidden" name="termsAccepted" value="yes" /><input type="hidden" name="termsVersion" value={TERMS_VERSION} /><input type="hidden" name="paymentOption" value={paymentOption} />
        <label className="final-consent"><input type="checkbox" name="billingConsent" value="yes" required /> <span>I authorize the selected payment schedule and agree to the annual membership terms.</span></label>
        <button className="button button-gold payment-cta" type="submit">Continue to secure checkout</button>
      </form>}
      <p className="legal-links"><button type="button" onClick={() => setOpen(true)}>Read terms and conditions</button><span>·</span><a href="/deductibles">Deductible terms</a></p>
    </article>
    {open && <div className="terms-overlay" role="dialog" aria-modal="true" aria-labelledby="terms-title"><div className="terms-modal">
      <div className="terms-modal-head"><div><small>MEMBERSHIP AGREEMENT</small><h2 id="terms-title">Terms and conditions</h2></div>{alreadyAccepted && <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">×</button>}</div>
      <div className="terms-scroll"><LegalTerms /></div>
      <div className="terms-accept"><label><input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} /> <span>I have read and agree to the $529.88 annual membership terms, payment options, deductibles, exclusions, and cancellation provisions.</span></label><button className="button button-gold" disabled={!checked} onClick={accept}>Accept and continue</button></div>
    </div></div>}
    <style jsx>{`
      .payment-shell{max-width:920px!important;padding:46px!important;border-radius:22px!important;background:linear-gradient(145deg,#0a1016,#111923)!important;border:1px solid #d7ad5c55!important;box-shadow:0 28px 70px #0006!important}.payment-intro{text-align:center;max-width:680px;margin:0 auto 30px}.payment-intro h1{font-size:46px!important;line-height:1.08!important;margin:12px 0 14px!important}.payment-intro>p:last-child{color:#aab6c1!important;font-size:16px!important}
      .payment-choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:28px 0}.payment-choice{min-height:275px;display:flex;flex-direction:column;align-items:flex-start;gap:9px;border:2px solid #273745;border-radius:16px;padding:27px;background:linear-gradient(155deg,#101a24,#0b1219);cursor:pointer;position:relative;transition:.2s ease}.payment-choice:hover{transform:translateY(-3px);border-color:#d7ad5c88}.payment-choice.selected{border-color:#d9b05d;background:linear-gradient(155deg,#182536,#101923);box-shadow:0 12px 38px #0005,0 0 0 1px #d9b05d33}.payment-choice input{position:absolute;opacity:0}.choice-check{position:absolute;right:20px;top:20px;width:27px;height:27px;display:grid;place-items:center;border-radius:50%;border:1px solid #536475;color:transparent}.selected .choice-check{background:#d9b05d;border-color:#d9b05d;color:#09243b;font-weight:900}.choice-kicker{font-size:10px;letter-spacing:.18em;color:#d9b05d;font-weight:800}.payment-choice strong{font:600 23px Georgia;color:#f7f1e8;margin-top:7px}.choice-price{font:400 53px/1 Georgia;color:#fff;margin:11px 0 3px}.choice-price sup{font:600 21px Arial;vertical-align:top;margin-right:3px}.choice-price small{font:600 18px Arial;color:#d6ae62}.choice-detail{color:#d8e0e6;font-weight:700;font-size:14px}.choice-note{color:#8fa0ae;font-size:12px;line-height:1.5;margin-top:auto}
      .payment-summary{border:1px solid #2d3c48;background:#0a1118;border-radius:12px;padding:18px 22px;display:grid;grid-template-columns:1fr auto;align-items:center;margin:8px 0 22px}.payment-summary span{color:#8fa0ae;font-size:11px;text-transform:uppercase;letter-spacing:.12em}.payment-summary strong{color:#f5d38f;font:600 20px Georgia}.payment-summary small{grid-column:1/-1;color:#8fa0ae;margin-top:6px}.payment-cta{width:100%;font-size:16px;border:0;cursor:pointer}.checkout-form{display:grid;gap:16px}.legal-links{display:flex!important;justify-content:center;gap:9px!important;margin-top:23px!important}
      @media(max-width:720px){.payment-shell{padding:28px 18px!important}.payment-intro h1{font-size:36px!important}.payment-choice-grid{grid-template-columns:1fr}.payment-choice{min-height:245px}.payment-summary{grid-template-columns:1fr;gap:6px}.payment-summary small{grid-column:auto}}
    `}</style>
  </>;
}
