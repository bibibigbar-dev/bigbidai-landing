const app = document.getElementById("app");

app.innerHTML = `
<header class="nav">
  <div class="wrap navin">
    <a class="brand" href="#top">bigbid <span>AI</span></a>
    <nav class="links">
      <a href="#product">Product</a><a href="#usecases">Use Cases</a><a href="#pricing">Pricing</a><a href="#testimonials">Testimonials</a><a href="#faq">FAQ</a>
      <a class="btn primary small" href="#pricing">Try for Free</a>
    </nav>
  </div>
</header>

<main id="top">
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <div class="eyebrow">AI inventory & auction listing automation</div>
      <h1>Take a photo.<br>AI builds the lot.</h1>
      <p class="lead">Turn product photos into auction-ready listings. bigbid AI identifies the item, generates the title and description, estimates MSRP, recommends a starting bid, and prepares your export.</p>
      <div class="cta-row"><a class="btn primary" href="#pricing">Try for Free →</a><a class="btn" href="#product">See How It Works</a></div>
      <div class="micro">First 10 items free · No credit card required · Mobile + Desktop</div>
      <div class="audience"><span class="chip">Resellers</span><span class="chip">Auction Houses</span><span class="chip">Wholesale</span><span class="chip">Warehouses</span><span class="chip">Liquidation</span><span class="chip">Pallet Sellers</span></div>
    </div>
    <div class="hero-visual" aria-label="bigbid AI product capture and analysis mockup">
      <div class="phone"><img src="assets/product-electronics.svg" alt="Unbranded wireless earbuds product photo analyzed by bigbid AI"></div>
      <div class="ai-card">
        <div class="ai-top"><strong>AI Product Analysis</strong><span class="status">● Complete</span></div>
        <div class="field"><small>Title</small><strong>Wireless Earbuds with Charging Case</strong></div>
        <div class="field"><small>Description</small><strong>Compact wireless earbuds with charging case. AI identifies the product, prepares listing details, and estimates resale pricing.</strong></div>
        <div class="result-grid"><div class="stat"><small>Estimated MSRP</small><b>$39.99</b></div><div class="stat"><small>Recommended Bid</small><b>$8</b></div></div>
        <div class="field"><small>Lot Number</small><strong>416j · HiBid export ready</strong></div>
        <a class="btn primary small" style="width:100%;margin-top:12px" href="#pricing">Try for Free</a>
      </div>
      <div class="float-tag tag1">Title ✓ Description ✓ MSRP ✓</div><div class="float-tag tag2">AI works in the background</div>
    </div>
  </div>
</section>

<section class="trust"><div class="wrap trust-in"><div><span>✓</span> Built for inventory-heavy sellers</div><div><span>✓</span> Mobile + desktop workflow</div><div><span>✓</span> AI product research</div><div><span>✓</span> HiBid-ready export workflow</div></div></section>

<section class="section" id="product"><div class="wrap">
  <div class="eyebrow">From manual work to one workflow</div><h2>Stop spending hours building lots manually.</h2><p class="lead">bigbid AI combines product photo recognition, listing generation, retail price research, auction pricing, lot numbering and export in one reseller inventory workflow.</p>
  <div class="problem-grid">
    <div class="panel bad"><h3>The old way</h3><div class="steps-mini"><div><span class="num">1</span>Take photos</div><div><span class="num">2</span>Search the product manually</div><div><span class="num">3</span>Find retail / MSRP</div><div><span class="num">4</span>Write title and description</div><div><span class="num">5</span>Choose starting bid</div><div><span class="num">6</span>Build Excel and rename pictures</div></div></div>
    <div class="panel good"><h3>With bigbid AI</h3><div class="steps-mini"><div><span class="num">1</span>Take a photo</div><div><span class="num">2</span>AI recognizes and researches the product</div><div><span class="num">3</span>AI generates title, description, MSRP and bid</div><div><span class="num">4</span>Review and export</div></div><a class="btn primary small" href="#pricing" style="margin-top:24px">Try 10 Items Free</a></div>
  </div>
</div></section>

<section class="section how"><div class="wrap"><div class="eyebrow">How it works</div><h2>Inventory in. Auction-ready lots out.</h2><p class="lead">Capture on the warehouse floor, review from your desk, then export for your auction workflow.</p>
  <div class="step-grid"><div class="step"><div class="n">01</div><h3>Capture</h3><p>Take one or multiple product photos from your phone or desktop.</p></div><div class="step"><div class="n">02</div><h3>Recognize</h3><p>AI identifies product type, brand, model, category and useful listing details.</p></div><div class="step"><div class="n">03</div><h3>Research & Price</h3><p>Generate title, description, estimated MSRP and a recommended starting bid.</p></div><div class="step"><div class="n">04</div><h3>Review & Export</h3><p>Review lots and export Excel / CSV plus product pictures for your auction workflow.</p></div></div>
  <a class="btn" href="#pricing">Try for Free →</a>
</div></section>

<section class="section"><div class="wrap"><div class="eyebrow">Built for high-volume listing</div><h2>Everything you need to build lots faster.</h2>
  <div class="features">
    <div class="feature"><div class="ico">AI</div><h3>AI Product Recognition</h3><p>Identify products from photos and turn visual inventory into structured listing data.</p></div>
    <div class="feature"><div class="ico">T</div><h3>Auto Titles & Descriptions</h3><p>Generate clean, auction-ready product titles and descriptions automatically.</p></div>
    <div class="feature"><div class="ico">$</div><h3>MSRP Estimation</h3><p>Research retail pricing and provide an estimated MSRP for each lot.</p></div>
    <div class="feature"><div class="ico">B</div><h3>Recommended Starting Bid</h3><p>Apply your auction pricing rules to automatically recommend a bid.</p></div>
    <div class="feature"><div class="ico">∞</div><h3>Continuous Capture</h3><p>Keep photographing inventory while previous lots process in the background.</p></div>
    <div class="feature"><div class="ico">⇩</div><h3>Excel + Picture Export</h3><p>Export spreadsheet data and organized images for downstream auction workflows.</p></div>
    <div class="feature"><div class="ico">#</div><h3>Automatic Lot Numbering</h3><p>Create sequential lot numbers such as 401j → 402j → 403j automatically.</p></div>
    <div class="feature"><div class="ico">▣</div><h3>Reference Product Photos</h3><p>Optionally add reference images from your selected sourcing site.</p></div>
    <div class="feature"><div class="ico">✓</div><h3>Batch Review</h3><p>Review titles, MSRP, bid recommendations and lot status from one queue.</p></div>
  </div>
</div></section>

<section class="section"><div class="wrap continuous">
  <div><div class="eyebrow">Continuous capture</div><h2>Photograph the whole pallet without waiting for AI.</h2><p class="lead">Save a lot, move straight to the next item, and let bigbid AI process the previous lot in the background.</p><div class="flow"><span>Lot 401 → Capture</span><i>→</i><span>Lot 402 → Capture</span><i>→</i><span>Lot 403 → Capture</span></div><p class="muted">Ideal for liquidation warehouses, pallet sellers and auction teams processing hundreds of items at a time.</p><a class="btn primary" href="#pricing">Try Continuous Capture</a></div>
  <div class="queue-card"><img src="assets/queue.svg" alt="Continuous lot capture queue in bigbid AI"></div>
</div></section>

<section class="section usecases" id="usecases"><div class="wrap"><div class="eyebrow">Use cases</div><h2>Built for businesses that move inventory.</h2><p class="lead">bigbid AI is designed for teams that need faster product identification, auction lot creation and warehouse listing automation.</p>
  <div class="case-grid"><div class="case"><strong>Resellers</strong><p>List returns, open-box products and liquidation inventory with less manual research.</p></div><div class="case"><strong>Auction Houses</strong><p>Create lots faster and prepare HiBid-ready data for recurring auctions.</p></div><div class="case"><strong>Wholesalers</strong><p>Process bulk inventory and generate structured product information for large batches.</p></div><div class="case"><strong>Warehouses</strong><p>Capture incoming inventory on the floor and review results from desktop.</p></div><div class="case"><strong>Liquidation Businesses</strong><p>Handle customer returns, overstock, shelf pulls and mixed pallets efficiently.</p></div><div class="case"><strong>Pallet Sellers</strong><p>Break down pallets into individual, auction-ready lots with consistent numbering.</p></div></div>
</div></section>

<section class="section"><div class="wrap"><div class="eyebrow">Product showcase</div><h2>Capture on mobile. Review on desktop. Export when ready.</h2>
  <div class="showcase-grid"><div class="shot"><img src="assets/capture.svg" alt="Mobile capture"><h3>1. Capture Products</h3><p>Take up to multiple photos per lot and move immediately to the next item.</p></div><div class="shot"><img src="assets/queue.svg" alt="Lot queue"><h3>2. AI Fills the Queue</h3><p>See titles, retail values and recommended bids populate as AI processing completes.</p></div><div class="shot"><img src="assets/settings.svg" alt="bigbid AI settings"><h3>3. Use Your Rules</h3><p>Control sourcing site, numbering sequence, lot letters and reference photos.</p></div></div>
</div></section>

<section class="section pricing" id="pricing"><div class="wrap"><div class="eyebrow">Simple pricing</div><h2>Start free. Scale when your inventory grows.</h2><p class="lead">Paid plan prices are billed monthly per user. One item analyzed and converted into a lot counts as one item. Editing or reviewing the same lot does not count again.</p>
  <div class="price-grid">
    <div class="price"><h3>Free</h3><div class="amount">$0</div><p>Test bigbid AI with real inventory.</p><ul><li>Up to 10 items</li><li>AI product recognition</li><li>Title & description generation</li><li>MSRP estimate</li><li>Recommended bid</li><li>Basic export</li></ul><a class="btn" href="#">Try for Free</a></div>
    <div class="price"><h3>Basic</h3><div class="amount">$29.99 <small>/ month / user</small></div><p>For resellers and auction sellers processing up to 300 items per month.</p><ul><li>Up to 300 items / month</li><li>All core AI features</li><li>Mobile + desktop</li><li>Standard Excel / CSV export</li><li>Reference product photos</li></ul><a class="btn" href="#">Get Started</a></div>
    <div class="price pop"><span class="ribbon">Most Popular</span><h3>Pro</h3><div class="amount">$99.99 <small>/ month / user</small></div><p>For auction and liquidation operations.</p><ul><li>Up to 1,000 items / month</li><li>Continuous capture mode</li><li>Background AI processing</li><li>Batch lot workflow</li><li>Automatic lot numbering</li><li>Full export tools</li><li>Priority processing</li></ul><a class="btn primary" href="#">Start Pro</a></div>
    <div class="price"><h3>Custom</h3><div class="amount">Let’s talk</div><p>For high-volume teams and custom workflows.</p><ul><li>Custom item volume</li><li>Team / warehouse setup</li><li>Custom bid rules</li><li>Custom import/export formats</li><li>Workflow integrations</li><li>Dedicated support</li></ul><a class="btn" href="mailto:support@bigbidai.com">Contact Us</a></div>
  </div>
</div></section>

<section class="section" id="testimonials"><div class="wrap"><div class="eyebrow">Customer stories</div><h2>Built around real inventory work.</h2><p class="muted" style="max-width:720px">Use verified customer quotes here once available. The samples below are placeholders and should not be published as real testimonials.</p>
  <div class="testimonials"><div class="quote"><em>Placeholder</em><p>“bigbid AI cut our lot creation workflow from repetitive research to a simple photo-and-review process.”</p><small>— Auction Business Owner</small></div><div class="quote"><em>Placeholder</em><p>“Continuous capture is the feature our pallet workflow needed. We can keep moving while AI works behind us.”</p><small>— Liquidation Reseller</small></div><div class="quote"><em>Placeholder</em><p>“Our warehouse team can capture products on mobile and finish the review from desktop without rebuilding the data.”</p><small>— Inventory Operations Manager</small></div></div>
</div></section>

<section class="section" id="faq"><div class="wrap faq"><div><div class="eyebrow">FAQ</div><h2>Questions before your first lot?</h2><p class="muted">bigbid AI is focused on making high-volume reseller and auction inventory easier to process.</p><a class="btn primary" href="#pricing">Try for Free</a></div><div class="faq-list">
  <div class="faq-item open"><button class="faq-q">What does bigbid AI do?<span>+</span></button><div class="faq-a">It turns product photos into structured listing information such as title, description, estimated MSRP, recommended starting bid and lot data for export.</div></div>
  <div class="faq-item"><button class="faq-q">Does it work on mobile and desktop?<span>+</span></button><div class="faq-a">Yes. You can capture inventory from a phone and review, edit and export your lots from desktop.</div></div>
  <div class="faq-item"><button class="faq-q">Can I use it with HiBid?<span>+</span></button><div class="faq-a">bigbid AI is designed to generate export-ready data and pictures that can fit a HiBid auction workflow. Exact import requirements can vary and should be reviewed before publishing.</div></div>
  <div class="faq-item"><button class="faq-q">How is MSRP determined?<span>+</span></button><div class="faq-a">AI researches available product information and returns an estimated retail/MSRP value. Pricing is an estimate and should be reviewed before use.</div></div>
  <div class="faq-item"><button class="faq-q">Can recommended bid rules be customized?<span>+</span></button><div class="faq-a">Yes. Custom plans can support tailored bid rules and workflow requirements. More self-service pricing controls can also be added to the product.</div></div>
  <div class="faq-item"><button class="faq-q">What happens after the first 10 items?<span>+</span></button><div class="faq-a">Choose the Basic, Pro or Custom plan based on your monthly item volume and workflow needs.</div></div>
</div></div></section>

<section class="final"><div class="wrap"><div class="finalbox"><div><div class="eyebrow" style="color:#bfe5d7">Start your first lot today</div><h2>Spend less time building lots. Spend more time selling.</h2><p>From single products to full liquidation pallets, bigbid AI helps resellers, auction houses, wholesale teams and warehouses turn photos into auction-ready inventory.</p></div><div><a class="btn" href="#pricing">Try 10 Items Free →</a><div style="font-size:12px;color:#d8eee6;margin-top:10px;text-align:center">No credit card required</div></div></div></div></section>
</main>

<footer><div class="wrap foot"><div><div class="brand">bigbid <span>AI</span></div><div class="muted" style="font-size:12px;margin-top:5px">bigbidai.com · AI-powered inventory and auction listing automation.</div></div><div class="footlinks"><a href="#product">Product</a><a href="#usecases">Use Cases</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a><a href="mailto:support@bigbidai.com">Contact</a><a href="#">Privacy</a><a href="#">Terms</a></div></div></footer>
`;

document.querySelectorAll(".faq-q").forEach((btn) => {
  btn.addEventListener("click", () => btn.parentElement.classList.toggle("open"));
});
