# Holdout scenarios

<!--
  THE BUILDER CANNOT READ THIS FILE. That is the only thing that makes it worth
  anything, and it is the only honest reason to merge code nobody reviewed.

  Rules:
  1. Composed multi-feature sequences.
  2. Values appearing nowhere else in the codebase.
  3. Exact figures asserted, not abstract properties.
-->

## Three Indian contacts created, one soft-deleted, and a cross-tag reassignment

1. Create contact `Devendra Joshi` with phone `+919920811234` and tag `Vendor`.
2. Create contact `Ananya Sen` with phone `+919830522345` and tag `Client`.
3. Create contact `Vikramaditya Rao` with phone `+919845633456` and tag `Vendor`.
4. Soft-delete `Devendra Joshi`.
5. Update `Vikramaditya Rao` by modifying his phone to `+919845633499` and assigning an additional tag `Client`.
6. Inspect the active contact overview:
   - Exactly 2 contacts are listed in the active contacts directory.
   - Searching for `Devendra` or `9920811234` returns 0 active results.
   - Filtering by tag `Client` lists exactly 2 contacts (`Ananya Sen` and `Vikramaditya Rao`).
   - Filtering by tag `Vendor` lists exactly 1 contact (`Vikramaditya Rao`).
   - Reload the application. All counts (2 active, 2 Client, 1 Vendor) remain identical.

## Contact deletion correctly reflects in data export

1. Create contact `Meera Nambiar` with phone `+919447155678` and email `mnambiar@example.in`.
2. Create contact `Tanmay Deshmukh` with phone `+919822366789` and email `tdeshmukh@example.in`.
3. Request a contact export. The exported record contains exactly 2 contact entries, containing `+919447155678` and `+919822366789`.
4. Delete `Meera Nambiar`.
5. Request a second contact export.
6. The second export contains exactly 1 entry (`Tanmay Deshmukh`) and zero occurrences of `Meera Nambiar` or `+919447155678`.
