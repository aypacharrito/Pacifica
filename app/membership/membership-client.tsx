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
    <article className="enrollment-card">
      <p className="eyebrow dark">ANNUAL MEMBERSHIP</p>
      <h1>Choose how you want to pay</h1>
      <p>Both options provide the same 12-month membership. Total annual price: $500.</p>
      <div className="payment-choice-grid">
        <label className={paymentOption === "annual" ? "payment-choice selected" : "payment-choice"}>
          <input type="radio" name="displayPaymentOption" checked={paymentOption === "annual"} onChange={() => setPaymentOption("annual")} />
          <strong>Pay in full</strong><b>$500 today</b><span>No monthly payments</span>
        </label>
        <label className={paymentOption === "installments" ? "payment-choice selected" : "payment-choice"}>
          <input type="radio" name="displayPaymentOption" checked={paymentOption === "installments"} onChange={() => setPaymentOption("installments")} />
          <strong>Payment plan</strong><b>$150 today</b><span>Then 10 payments of $31.82 and a final payment of $31.80</span>
        </label>
      </div>
      {!accepted ? <button className="button button-gold" onClick={() => setOpen(true)}>Review membership terms</button> :
      <form action="/api/stripe/checkout" method="post">
        <input type="hidden" name="termsAccepted" value="yes" /><input type="hidden" name="termsVersion" value={TERMS_VERSION} /><input type="hidden" name="paymentOption" value={paymentOption} />
        <label className="final-consent"><input type="checkbox" name="billingConsent" required /> <span>I authorize the payment option selected above and agree to the annual membership terms.</span></label>
        <button className="button button-gold" type="submit">Continue to secure checkout</button>
      </form>}
      <p className="legal-links"><button type="button" onClick={() => setOpen(true)}>Read terms and conditions</button> · <a href="/deductibles">Deductible terms</a></p>
    </article>
    {open && <div className="terms-overlay" role="dialog" aria-modal="true" aria-labelledby="terms-title"><div className="terms-modal">
      <div className="terms-modal-head"><div><small>MEMBERSHIP AGREEMENT</small><h2 id="terms-title">Terms and conditions</h2></div>{alreadyAccepted && <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">×</button>}</div>
      <div className="terms-scroll"><LegalTerms /></div>
      <div className="terms-accept"><label><input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} /> <span>I have read and agree to the $500 annual membership terms, payment options, deductibles, exclusions, and cancellation provisions.</span></label><button className="button button-gold" disabled={!checked} onClick={accept}>Accept and continue</button></div>
    </div></div>}
  </>;
}
