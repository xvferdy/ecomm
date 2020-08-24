# ecomm

## :round_pushpin:Table of Contents
- [About The Project](#about-the-project)
    - [Built with](#built-with)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [File Structure Overview](#file-structure-overview)
- [How to Use](#how-to-use)
    - [Getting it](#getting-it)
    - [Installing It](#installing-it)
    - [Configuring It](#configuring-it)
    - [Running it](#running-it)
- [👾 Credits](#-credits)

## About the Project
> :basecampy: _Learning basic backend_

A final project from Colt and Stephen's course. Creating an E-Commerce web application that have page for **Public user pages** (Homepage, Cart), **Administrators pages** (List of all products , Create product page, Delete product page, Edit product page), and **Admin signup and login pages** (Signup page, Signin page).

### Built With
- [Javascript](https://www.javascript.com/)
- [Express](https://expressjs.com/)

## Getting Started
### Prerequisites
- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)

### File Structure Overview
```
ecomm
├── node_modules
├── public
│   ├── css
│   │   └── main.css
│   ├── favicon
│   │   └── favicon.ico
│   └── images
│       └── banner.jpg
├── repositories
│   ├── carts.js
│   ├── products.js
│   ├── repository.js
│   └── users.js
├── routes
│   ├── admin
│   │   ├── auth.js
│   │   ├── middlewares.js
│   │   ├── products.js
│   │   └── validators.js
│   ├── carts.js
│   └── products.js
├── views
│   ├── admin
│   │   ├── auth
│   │   │   ├── signin.js
│   │   │   └── signup.js
│   │   ├── products
│   │   │   ├── edit.js
│   │   │   ├── index.js
│   │   │   └── new.js
│   │   └── layout.js
│   ├── carts
│   │   └── show.js
│   ├── products
│   │   └── index.js
│   ├── helpers.js
│   └── layout.js
├── .gitattributes
├── .gitignore
├── carts.json
├── index.js
├── package.json
├── package-lock.json
├── products.json
├── users.json
└── README.md
```

## How to Use
### Getting it
Download or clone
```
git clone https://github.com/xvferdy/ecomm.git
```

### Installing It
```
npm install
```

### Configuring It
###### package.json
```
{
  "scripts": {
    "dev": "nodemon index.js"
  },
}
```

### Running it
```
npm run dev
```
http://localhost:3000/ for users facing products

http://localhost:3000/admin/products for admin panel (signin first)

## 👾 Credits
**Instructors**
- [Colt Steele](https://www.youtube.com/c/ColtSteeleCode "Colt's youtube") :tv:
- [Stephen ](https://github.com/StephenGrider "Stephen's github") :octocat:

**Other tools**
- [javascript](https://www.javascript.com/) - _to create our custom database_
- [Font Awesome](https://fontawesome.com/) - _free icon_
- [Bulma](https://bulma.io/) - _cool css framework_
- [cookie-session](https://www.npmjs.com/package/cookie-session) - _to create browser session_
- [express](https://www.npmjs.com/package/express)
- [express-validator](https://www.npmjs.com/package/express-validator) - _auth purpose and for other validator_
- [multer](https://www.npmjs.com/package/multer) - _for image upload process_
- [nodemon](https://www.npmjs.com/package/nodemon)
