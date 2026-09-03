# End-to-end journeys

An agent reads this every validation run, drives the running application, and reports what it observed.

## A user creates, searches for, and updates an Indian contact

1. Navigate to the contact creation form.
2. Add a new contact with:
   - First Name: `Aarav`
   - Last Name: `Sharma`
   - Phone: `+919820155432`
   - Email: `aarav.sharma@example.in`
   - Tag: `Work`
   - Notes: `Tech Consultant in Bangalore`
3. Save the contact and return to the main contact list.
4. Type `9820155432` into the search box. Aarav Sharma appears in the search results with the `Work` badge.
5. Open Aarav's contact details, change the tag to `VIP`, and update the note to `Key technical partner`.
6. Reload the contact page. Aarav Sharma displays the tag `VIP` and the note `Key technical partner`.

**What would make this fail:** the contact does not appear in search by phone number, the tag update fails to persist after reload, or phone formatting is lost.

## Filtering contacts by tag and inspecting counts

1. Add contact `Rohan Mehta` with phone `+919811234567` and tag `Contractor`.
2. Add contact `Pooja Iyer` with phone `+919740567890` and tag `VIP`.
3. Filter the contact view by the tag `VIP`.
4. The list displays exactly the contacts tagged `VIP` (`Aarav Sharma` and `Pooja Iyer`), and does not display `Rohan Mehta`.
5. The tag filter counter displays `2 contacts`.

**What would make this fail:** contacts without the selected tag appear in the filtered view, the count does not match the filtered results, or selecting a filter clears all contacts.

## Input validation for India (+91) numbers and persistence across server restarts

1. Attempt to create a contact with a non-Indian phone number `+14155552671` or invalid format `9876`.
2. Verify that the form prevents submission and displays a validation error requiring a valid 10-digit Indian phone number (+91).
3. Correct the phone number to `+919833445566` for contact name `Kavita Patel` and submit successfully.
4. Restart or reload the application session.
5. Search for `Kavita Patel`. The record is present with phone `+919833445566`.

**What would make this fail:** non-Indian phone formats bypass validation, or newly created records vanish upon reloading.
