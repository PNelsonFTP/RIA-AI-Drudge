import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { extractFinraNotices, extractJumpPosts, extractZocksPosts, parseLooseDate } from "./listingCards";

describe("listing cards", () => {
  it("parses full and abbreviated month dates", () => {
    assert.equal(parseLooseDate("September 11, 2026"), "2026-09-11T00:00:00.000Z");
    assert.equal(parseLooseDate("Sep 18, 2026"), "2026-09-18T00:00:00.000Z");
    assert.equal(parseLooseDate("2026-09-14T20:03:18.228Z"), "2026-09-14T20:03:18.228Z");
  });

  it("reads a FINRA notice description from the description cell", () => {
    const html = `
      <tr>
        <td class="views-field views-field-field-core-official-dt">September 18, 2026</td>
        <td class="views-field views-field-title"><a target="_blank" href="/rules-guidance/notices/26-16">Regulatory Notice 26-16</a></td>
        <td class="views-field views-field-field-notice-title-tx"><div>FINRA Requests Comment on Artificial Intelligence in Communications with the Public</div></td>
      </tr>
      <tr>
        <td class="views-field views-field-field-core-official-dt">August 1, 2026</td>
        <td><a href="/rules-guidance/notices/26-15">Regulatory Notice 26-15</a></td>
        <td class="views-field views-field-field-notice-title-tx"><div>Election of FINRA District Committee Members</div></td>
      </tr>
    `;
    const cards = extractFinraNotices(html);
    assert.equal(cards.length, 2);
    assert.equal(cards[0].href, "/rules-guidance/notices/26-16");
    assert.equal(cards[0].title, "FINRA Requests Comment on Artificial Intelligence in Communications with the Public");
    assert.equal(cards[0].dateRaw, "September 18, 2026");
  });

  it("reads Jump blog cards when class comes before href", () => {
    const html = `<a class="shadow" href="/blog/ai-maturity-model" data-discover="true"><div><time class="caption" dateTime="2026-09-14T20:03:18.228Z">September 14, 2026</time><h3 class="b1 mb-3">Introducing the AI Maturity Model for Enterprise Wealth Management</h3></div></a>`;
    const cards = extractJumpPosts(html);
    assert.equal(cards.length, 1);
    assert.equal(cards[0].title, "Introducing the AI Maturity Model for Enterprise Wealth Management");
    assert.equal(cards[0].dateRaw, "2026-09-14T20:03:18.228Z");
  });

  it("reads Zocks blog cards", () => {
    const html = `<a href="/blog/top-fireflies-ai-alternatives-for-financial-advisors-in-2026" class="nav-blog_card w-inline-block"><img alt="Top Fireflies AI Alternatives for Financial Advisors in 2026"/><div class="text-size-small">September 11, 2026</div></a>`;
    const cards = extractZocksPosts(html);
    assert.equal(cards.length, 1);
    assert.match(cards[0].title, /Fireflies/);
    assert.equal(cards[0].dateRaw, "September 11, 2026");
  });
});
