# HQ Logistics Application

This is an app that is made to account for logistics in store taking as well as loaning between departments of an organisation.

# Features
---
**Current Features**:
- User Login
- List store items
- Store items in DB
- Add new items (admin only)
- Edit and delete items (admin only)
- Borrow items
- Return items
- Approve Loans (admin only) 




# Tech
---
This app is built with the following technologies:
- NodeJS
- React
- Firebase (Authentication, Database)
- Formik (Forms Stuff)

# Database Information
---
This project uses Firebase for authentication and database functions. The following are the descriptions of what each database table does:
- Items
    - Catalogue of all items in the organisation. Also lists number that are currently on loan.
- On_loan
    - Catalogue of loan requests by all users. Details item on loan, who it is borrowed by, and the quantity requested. It will also control whether a loan is approved or denied
- Users
    - All relevant information about users.
    - IMPORTANT: the Firestore "Document ID" is the same as the user's UID stored in Firebase authentication


# Changelog
--- 

** 10/07/23 **
- Bug fixes for loan and approval system
- Added "Issue" item function: admin will now be able to issue items and deduct directly from the item's quantity

** 27/06/23 **
- Initial Release


# Credits
--- 
This project uses different resources to Make Stuff work.

- Material UI (https://mui.com/)
- Firebase
- ReactJS