import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { matchesRequireAny } from "./requireAny";

describe("matchesRequireAny", () => {
  it("matches AI at the start of a title via the trimmed short token", () => {
    assert.equal(matchesRequireAny("AI supervision update", "", ["ai"]), true);
  });

  it("does not treat 'available' as AI", () => {
    assert.equal(matchesRequireAny("available training daily", "", ["ai"]), false);
  });

  it("matches ChatGPT for gpt or chatgpt needles", () => {
    assert.equal(matchesRequireAny("ChatGPT for RIAs", null, ["gpt"]), true);
    assert.equal(matchesRequireAny("ChatGPT for RIAs", null, ["chatgpt"]), true);
  });

  it("matches LLM / LLMs either way", () => {
    assert.equal(matchesRequireAny("New LLMs arrive", "", ["llm"]), true);
    assert.equal(matchesRequireAny("New LLMs arrive", "", ["llms"]), true);
    assert.equal(matchesRequireAny("A new LLM ships", "", ["llms"]), true);
  });

  it("matches hyphenated GPT versions", () => {
    assert.equal(matchesRequireAny("Advisory firms adopt GPT-5", "", ["gpt"]), true);
    assert.equal(matchesRequireAny("Advisory firms adopt GPT-5", "", ["chatgpt"]), true);
  });

  it("matches AI as a mid-title word", () => {
    assert.equal(matchesRequireAny("The AI revolution in wealth", "", ["ai"]), true);
  });

  it("matches RIAs, A.I., GPT4, and xAI", () => {
    assert.equal(matchesRequireAny("Tools for RIAs", "", ["ria"]), true);
    assert.equal(matchesRequireAny("The A.I. exam", "", ["ai"]), true);
    assert.equal(matchesRequireAny("Firms adopt GPT4", "", ["gpt"]), true);
    assert.equal(matchesRequireAny("xAI opens a desk", "", ["xai"]), true);
  });

  it("does not treat cybersecurity as the word security", () => {
    assert.equal(matchesRequireAny("cybersecurity drill", "", ["security"]), false);
    assert.equal(matchesRequireAny("model security review", "", ["security"]), true);
  });

  it("does not match 'said' as AI", () => {
    assert.equal(matchesRequireAny("said the chair", "", ["ai"]), false);
  });

  it("treats empty needles as a pass and matches AI- prefixes", () => {
    assert.equal(matchesRequireAny("anything", "", []), true);
    assert.equal(matchesRequireAny("AI-powered notetaker", "", ["ai"]), true);
    assert.equal(matchesRequireAny("SEC warns on AI-washing", "", [" ai "]), true);
  });
});
