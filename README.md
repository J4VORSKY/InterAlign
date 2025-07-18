# InterAlign

## Installation

After installing Node.js, run `npm install` and then `npm start`.

# Annotation application controls

## Mouse

- Clicking on words, labels makes them selected either to a phrase or word alignment.
- Making a selection (clicking on a word, holding mouse button and selecting a span of words) makes all words in the selection selected for a phrase alignment.
- Clicking on “delete” next to the alignment removes it from the list of alignments.

## Keyboard

- Left Arrow: Moving focus to the word on the left hand side of the currently focused word.
- Right Arrow: Moving focus to the word on the right hand side of the currently focused word.
- Up Arrow: Jumps in or out of selected phrase alignment.
- Shift + Right Arrow: Making phrase selection to the left.
- Shift + Left Arrow: Making phrase selection to the right.
- Ctrl + Right Arrow: Scrolling textbox to the right.
- Ctrl + Left Arrow: Scrolling textbox to the left.
- Tab: Making next item selected in this order: Source transcript → target transcript → Phrase Level Labels or Word Level Labels → Notes → Align Pairs Button
- Escape: Deselects all candidates to the current phrase alignment.
- Enter: Create alignment.

## Annotation tips
1. Try out using a keyboard, it can be faster in some cases.
2. Do not use mouse clicking when selecting phrase alignment – it is too slow to click on all words in the row. Use shift and arrows on the keyboard or holding a mouse button and moving.

## Annotation application components

From top to bottom:
1. Upload alignment button
2. Speech transcript
3. Interpretation transcript
4. Phrase-level labels
5. Word-level labels
6. Notes area
7. Aligned pairs button
8. The list of alignments
9. Delete button of an alignment
10. Download alignment button

