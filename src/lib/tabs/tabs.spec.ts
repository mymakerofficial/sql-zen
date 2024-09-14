import { describe, it, expect, afterEach } from 'vitest'
import { TabManager } from '@/lib/tabs/manager/manager'
import { TabType } from '@/lib/tabs/enums'

function lastOf<T>(arr: T[]): T {
  return arr[arr.length - 1]
}

function firstOf<T>(arr: T[]): T {
  return arr[0]
}

function secondOf<T>(arr: T[]): T {
  return arr[1]
}

describe('Tabs', () => {
  const manager = new TabManager()

  function createTestTab() {
    return manager.createTab({
      type: TabType.Test,
      displayName: 'Test',
      defaultDisplayName: 'Default',
    })
  }

  function createMultipleTestTabs(count: number) {
    return Array.from({ length: count }, (_) => createTestTab())
  }

  afterEach(() => {
    manager.getTabIds().forEach((it) => manager.removeTab(it))
  })

  it('should set the display name to the default value if no explicit name is proved', () => {
    const tab = manager.createTab({
      type: TabType.Test,
      defaultDisplayName: 'Default',
    })

    expect(tab.displayName).toBe('Default')
  })

  it('should set the display name to the given value if one is provided', () => {
    const tab = manager.createTab({
      type: TabType.Test,
      displayName: 'Custom',
      defaultDisplayName: 'Default',
    })

    expect(tab.displayName).toBe('Custom')
  })

  describe('tabs should always have unique display names', () => {
    it('should append a number to the display name if it is not unique', () => {
      createMultipleTestTabs(3)

      expect(manager.getTabInfos()).toEqual([
        expect.objectContaining({ displayName: 'Test' }),
        expect.objectContaining({ displayName: 'Test (2)' }),
        expect.objectContaining({ displayName: 'Test (3)' }),
      ])
    })

    it('should handle last of duplicate names being removed', () => {
      const tabs = createMultipleTestTabs(3)

      manager.removeTab(lastOf(tabs).id)

      const newTab = createTestTab()

      expect(newTab.displayName).toBe('Test (3)')
      expect(manager.getTabInfos()).toEqual([
        expect.objectContaining({ displayName: 'Test' }),
        expect.objectContaining({ displayName: 'Test (2)' }),
        expect.objectContaining({ displayName: 'Test (3)' }),
      ])
    })

    it('should handle middle of duplicate names being removed', () => {
      const tabs = createMultipleTestTabs(3)

      manager.removeTab(secondOf(tabs).id)

      const newTab = createTestTab()

      expect(newTab.displayName).toBe('Test (2)')
      expect(manager.getTabInfos()).toEqual([
        expect.objectContaining({ displayName: 'Test' }),
        expect.objectContaining({ displayName: 'Test (3)' }),
        expect.objectContaining({ displayName: 'Test (2)' }),
      ])
    })

    it('should handle first of duplicate names being removed', () => {
      const tabs = createMultipleTestTabs(3)

      manager.removeTab(firstOf(tabs).id)

      createMultipleTestTabs(3)

      expect(manager.getTabInfos()).toEqual([
        expect.objectContaining({ displayName: 'Test (2)' }),
        expect.objectContaining({ displayName: 'Test (3)' }),
        expect.objectContaining({ displayName: 'Test' }),
        expect.objectContaining({ displayName: 'Test (4)' }),
        expect.objectContaining({ displayName: 'Test (5)' }),
        expect.objectContaining({ displayName: 'Test (6)' }),
      ])
    })

    it('should handle duplicate names being renamed', () => {
      const tabs = createMultipleTestTabs(3)

      secondOf(tabs).displayName = 'Custom'

      createMultipleTestTabs(2)

      expect(manager.getTabInfos()).toEqual([
        expect.objectContaining({ displayName: 'Test' }),
        expect.objectContaining({ displayName: 'Custom' }),
        expect.objectContaining({ displayName: 'Test (3)' }),
        expect.objectContaining({ displayName: 'Test (2)' }),
        expect.objectContaining({ displayName: 'Test (4)' }),
      ])
    })

    it('should handle duplicate names being renamed to the same name', () => {
      const tabs = createMultipleTestTabs(3)

      secondOf(tabs).displayName = 'Test'

      expect(manager.getTabInfos()).toEqual([
        expect.objectContaining({ displayName: 'Test' }),
        expect.objectContaining({ displayName: 'Test (2)' }),
        expect.objectContaining({ displayName: 'Test (3)' }),
      ])
    })
  })
})
