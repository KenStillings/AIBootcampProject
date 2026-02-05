# Sprint 7: Update Pagination to 3-Column Layout

**Sprint Goal**: Update pagination layout from 2 columns to 3 columns with 7 items per column (21 items per page total)

**Duration**: 2 hours

**Date**: February 5, 2026

---

## Sprint Overview

This sprint focuses on updating the existing pagination feature to display 3 columns instead of 2, with 7 items per column for a total of 21 items per page. This provides better visual density and allows users to see more content at a glance while maintaining readability.

---

## Tasks

### Task 7.1: Update Pagination Service (15 minutes)
**File**: `src/scripts/paginationService.ts`

**Objective**: Change items per page from 50 to 21

**Actions**:
- Update `itemsPerPage` constant from 50 to 21
- Update comments to reflect "3 columns × 7 items per column"

**Expected Outcome**: Pagination service calculates pages based on 21 items per page

**Acceptance Criteria**:
- ✅ `itemsPerPage` is set to 21
- ✅ Comments accurately describe the 3-column layout
- ✅ All existing pagination methods work correctly with new page size

---

### Task 7.2: Update CSS Grid Layout (20 minutes)
**File**: `src/styles/main.css`

**Objective**: Change file-list grid from 2 columns to 3 columns

**Actions**:
- Update `.file-list` grid-template-columns from `repeat(2, 1fr)` to `repeat(3, 1fr)`
- Update responsive breakpoint to use 2 columns on tablets (768px-1024px)
- Keep single column on mobile (< 768px)

**Expected Outcome**: File list displays in 3 columns on desktop, 2 on tablets, 1 on mobile

**Acceptance Criteria**:
- ✅ Desktop (>1024px): 3 columns
- ✅ Tablet (768px-1024px): 2 columns
- ✅ Mobile (<768px): 1 column
- ✅ Grid maintains proper spacing and alignment

---

### Task 7.3: Update Pagination Tests (30 minutes)
**File**: `tests/paginationService.test.ts`

**Objective**: Update unit tests to reflect new 21 items per page

**Actions**:
- Update test expectations for page calculations
  - 100 items = 5 pages (was 2 pages)
  - 75 items = 4 pages (was 2 pages)
  - 150 items = 8 pages (was 3 pages)
  - 1,348 items = 65 pages (was 27 pages)
- Update test data arrays to use appropriate sizes
- Verify all edge cases still work correctly

**Expected Outcome**: All 46 pagination tests pass with updated page calculations

**Acceptance Criteria**:
- ✅ All tests pass with new itemsPerPage value
- ✅ Page calculation tests reflect correct math (ceiling(items/21))
- ✅ Edge case tests (50 items, 51 items) updated to (21 items, 22 items)
- ✅ Large dataset test updated (1,348 items = 65 pages)

---

### Task 7.4: Build and Verify (20 minutes)

**Objective**: Compile and test the updated pagination

**Actions**:
1. Run `npm run build` to compile TypeScript
2. Run `npm run test:coverage` to verify all tests pass
3. Start development server with `npm start`
4. Test with FileList.csv (1,348 files)
5. Verify pagination shows 65 pages
6. Test page navigation (first, last, next, previous)
7. Test responsive layout on different screen sizes
8. Verify filtering/searching resets to page 1

**Expected Outcome**: Application works correctly with 3-column, 21 items per page layout

**Acceptance Criteria**:
- ✅ TypeScript compiles without errors
- ✅ All 122 tests pass
- ✅ Test coverage remains ≥80%
- ✅ File list displays 21 items per page in 3 columns
- ✅ 1,348 files = 65 pages total
- ✅ Page 1 shows items 1-21
- ✅ Page 2 shows items 22-42
- ✅ Page 65 shows items 1,345-1,348 (4 items)
- ✅ Responsive layout works on all screen sizes
- ✅ All navigation controls work correctly
- ✅ Filtering resets pagination properly

---

### Task 7.5: Documentation Updates (15 minutes)

**Objective**: Update documentation to reflect new pagination configuration

**Actions**:
- Update README.md to mention "21 items per page (3 columns × 7 items)"
- Update CHANGELOG.md with Sprint 7 entry
- Update Sprint 7 task plan status

**Expected Outcome**: Documentation accurately reflects 3-column pagination

**Acceptance Criteria**:
- ✅ README.md updated with correct pagination info
- ✅ CHANGELOG.md includes Sprint 7 changes
- ✅ All documentation is accurate

---

## Technical Details

### Files to Modify

1. **src/scripts/paginationService.ts**
   - Line 16: `itemsPerPage: 50,` → `itemsPerPage: 21,`
   - Line 16 comment: Update to "3 columns × 7 items per column"

2. **src/styles/main.css**
   - `.file-list` grid-template-columns: `repeat(3, 1fr)`
   - Add tablet breakpoint at 1024px for 2 columns
   - Existing mobile breakpoint at 768px for 1 column

3. **tests/paginationService.test.ts**
   - Update all test expectations for page counts
   - Update test data arrays
   - Update edge case values

### Expected Changes

| Metric | Sprint 6 | Sprint 7 |
|--------|----------|----------|
| Columns (Desktop) | 2 | 3 |
| Items per Column | 25 | 7 |
| Items per Page | 50 | 21 |
| Pages for 1,348 files | 27 | 65 |
| Page 1 Items | 1-50 | 1-21 |
| Last Page Items | 1,301-1,348 (48) | 1,345-1,348 (4) |

### Responsive Breakpoints

```css
/* Desktop (>1024px) */
.file-list {
  grid-template-columns: repeat(3, 1fr);
}

/* Tablet (768px-1024px) */
@media (max-width: 1024px) {
  .file-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile (<768px) */
@media (max-width: 768px) {
  .file-list {
    grid-template-columns: 1fr;
  }
}
```

---

## Testing Checklist

### Unit Tests
- [ ] All 46 pagination tests pass
- [ ] Page calculation tests updated
- [ ] Edge case tests updated
- [ ] Coverage ≥80%

### Manual Tests
- [ ] Desktop: 3 columns visible
- [ ] Tablet: 2 columns visible
- [ ] Mobile: 1 column visible
- [ ] Pagination shows "Page 1 of 65"
- [ ] Navigation buttons work
- [ ] Filter/search resets to page 1
- [ ] Page numbers display correctly
- [ ] Disabled states work on boundaries

---

## Definition of Done

- [ ] Code changes implemented
- [ ] All unit tests passing (122/122)
- [ ] Test coverage ≥80%
- [ ] TypeScript compiles without errors
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] Code committed to git
- [ ] Changes pushed to remote branch

---

## Notes

- This sprint is a simple configuration change, not a feature addition
- Existing pagination logic remains unchanged
- Only the `itemsPerPage` value and CSS grid columns change
- All 46 existing pagination tests will be reused with updated expectations
- No new files created, only modifications to existing files
- Estimated total time: 2 hours
- Can be completed in a single focused work session

---

## Dependencies

- Sprint 6 must be complete (pagination already implemented)
- No external dependencies
- No new packages required

---

## Risks & Mitigation

**Risk**: Tests may fail if expectations not updated correctly  
**Mitigation**: Update all test expectations systematically, run tests frequently

**Risk**: Responsive layout may not look good with 3 columns on smaller screens  
**Mitigation**: Add tablet breakpoint (1024px) to reduce to 2 columns before mobile

---

## Sprint 7 Summary

Sprint 7 is a targeted configuration update to improve the visual density of the file list by increasing from 2 to 3 columns while reducing items per column from 25 to 7. This results in 21 items per page instead of 50, providing users with a more compact view while maintaining readability. The sprint includes updating the pagination service constant, CSS grid layout with responsive breakpoints, comprehensive test updates, and documentation changes.
