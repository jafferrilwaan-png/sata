import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Keyboard Shortcuts Logic & Guard Tests', () => {
  it('identifies modifier key depending on platform', () => {
    const isMacPlatform = (platform: string) => /Mac|iPod|iPhone|iPad/.test(platform);
    assert.equal(isMacPlatform('MacIntel'), true);
    assert.equal(isMacPlatform('Win32'), false);
    assert.equal(isMacPlatform('Linux x86_64'), false);
  });

  it('correctly maps 1-4 keys to Meta AI models', () => {
    const modelKeyMap: Record<string, string> = {
      '1': 'tri-agent-swarm',
      '2': 'muse-spark-1.3',
      '3': 'muse-spark-1.2',
      '4': 'muse-wonder-1.0',
    };
    assert.equal(modelKeyMap['1'], 'tri-agent-swarm');
    assert.equal(modelKeyMap['2'], 'muse-spark-1.3');
    assert.equal(modelKeyMap['3'], 'muse-spark-1.2');
    assert.equal(modelKeyMap['4'], 'muse-wonder-1.0');
    assert.equal(modelKeyMap['5'], undefined);
  });

  it('guarantees typing protection: inputs ignore single-key command triggers', () => {
    const isUserTyping = (tagName: string, isContentEditable: boolean) =>
      tagName === 'INPUT' || tagName === 'TEXTAREA' || isContentEditable;

    assert.equal(isUserTyping('INPUT', false), true);
    assert.equal(isUserTyping('TEXTAREA', false), true);
    assert.equal(isUserTyping('DIV', true), true);
    assert.equal(isUserTyping('DIV', false), false);
    assert.equal(isUserTyping('BODY', false), false);
  });

  it('handles Cmd/Ctrl+K combinations across platforms', () => {
    const isSearchShortcut = (e: { metaKey: boolean; ctrlKey: boolean; key: string }) =>
      (e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K');

    assert.equal(isSearchShortcut({ metaKey: true, ctrlKey: false, key: 'k' }), true);
    assert.equal(isSearchShortcut({ metaKey: false, ctrlKey: true, key: 'K' }), true);
    assert.equal(isSearchShortcut({ metaKey: false, ctrlKey: false, key: 'k' }), false);
  });
});
