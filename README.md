This project implements a robust authentication and authorization system using **Passport.js**. It allows users to securely log in, log out, and sign up, while ensuring role-based access control for different sections of the application.

## Key Features

1. **User Authentication with Passport.js** 
   - Added login and logout functionality using Passport.js.
   - Users can securely log in and log out from the application.
   - Session management is handled to keep users logged in during their session.

2. **Authorization**
   - Redirects users to the login page if they attempt to access restricted areas without authentication.
   - After successful login, users are automatically redirected to the page they initially requested.
   - Role-based authorization ensures only authorized users can access or modify listings and reviews.

3. **List Owner Schema**
   - Introduced a "list owner" in the schema, defining ownership and access permissions for managing listings.
   - Owners have full control over their listings, such as editing, updating, and deleting them.

4. **Image Upload**
   - Integrated image upload functionality for profile pictures and listing images.
   - Uploaded images are stored in the `uploads` directory.

5. **Enhanced Routes**
   - Refined existing routes in `listing.js` to include authorization checks for listing owners.
   - Created new routes in `user.js` to manage user authentication, including signup and login.

## File Changes

- **app.js**: Integrated Passport.js for user session management and authentication.
- **middleware.js**: New middleware to check authentication and authorization before accessing protected routes.
- **models/user.js**: User model created to handle user data, including registration, login, and ownership details.
- **public/images/logo.png**: Added a project logo image.
- **routes/listing.js**: Modified listing routes to check authorization for list owners.
- **routes/user.js**: New user routes for login, signup, and logout.
- **uploads/**: Uploaded images directory, containing user-uploaded content.
- **views/includes/navbar.ejs**: Updated navigation bar to reflect user login/logout state.
- **views/layouts/boilerplate.ejs**: General layout updates for user sessions and authentication checks.
- **views/lists/edit.ejs**: Adjustments to allow list owners to edit their own listings.
- **views/lists/new.ejs**: Adjustments for list creation by authenticated users.
- **views/user/login.ejs**: New login page for user authentication.
- **views/user/signup.ejs**: New signup page for user registration.
