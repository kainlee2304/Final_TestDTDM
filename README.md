## **Configuring, Setting Up, Connecting to Database, and Deploying Product Listing Function**

**Introduction**

Hello everyone! My name is Nguyen. Today, I talk about our project, `Final_TestDTDM`. This is a simple app. It uses Node.js and PostgreSQL. We put it on Railway. I will show you how to set up, connect to the database, and deploy the product listing function. This function helps users see all products or search products. Let’s start!

---

**What is Product Listing Function?**

First, I explain the product listing function. In our app, we have two actions:
- **See all products**: This is the `GET /products/all` API. It shows all products in the database.
- **Search products**: This is the `GET /products` API. It finds products by name or category.

These actions help users see product information like name, price, and image. Now, I show you how to build this step by step.

---

**Step 1 – Set Up the Environment**

First, we set up our computer to work on the project. Here are the steps:

1. **Install Node.js**:
   - Go to the Node.js website.
   - Download and install Node.js. I use version 22.14.0.
   - Check if it works. Open your terminal and type:
     ```
     node -v
     ```
   - You see the version, like `22.14.0`.

2. **Make Project Folders**:
   - Make a folder called `Final_TestDTDM`.
   - Inside, make two folders: `backend` and `frontend`.
   - Go to the `backend` folder and type:
     ```
     npm init -y
     ```
   - This makes a `package.json` file.

3. **What is `package.json`?**:
   - The `package.json` file is very important. It tells Node.js what tools we need and how to start the app.
   - Here is my `package.json` in the `backend` folder:
     ```
     {
       "name": "final_testdtdm_backend",
       "version": "1.0.0",
       "description": "Backend for Final_TestDTDM",
       "main": "index.js",
       "scripts": {
         "start": "node index.js"
       },
       "dependencies": {
         "dotenv": "^16.5.0",
         "express": "^4.18.2",
         "multer": "^1.4.5-lts.2",
         "pg": "^8.11.3"
       }
     }
     ```
   - **Why is it useful?**:
     - It has tools we need, like `express` for APIs and `pg` for the database.
     - The `start` script (`node index.js`) helps Railway run our app.
     - It makes sure everyone uses the same tools when they work on the project.

4. **Install Tools for Backend**:
   - In the `backend` folder, type this command:
     ```
     npm install express pg
     ```
   - This installs `express` and `pg`. They are in `package.json`. `express` makes APIs. `pg` talks to the database.

5. **Set Up Code Editor**:
   - I use Visual Studio Code. It is easy.
   - Open the `Final_TestDTDM` folder in Visual Studio Code.

---

**Step 2 – Connect to the Database**

Next, we connect our app to the PostgreSQL database. We use Railway to make a database. Here are the steps:

1. **Make Database on Railway**:
   - Go to [Railway website](https://railway.app).
   - Sign in with GitHub.
   - Click **New Project**.
   - Click **New** > **Database** > **PostgreSQL**.
   - Railway makes a database. It gives you a `DATABASE_URL`. It looks like this:
     ```
     postgresql://postgres:password@hostname:port/railway
     ```

2. **Write Code to Connect**:
   - In the `backend` folder, make a file called `db.js`.
   - Add this code:
     ```
     const { Pool } = require("pg");

     const pool = new Pool({
       connectionString: process.env.DATABASE_URL,
       ssl: { rejectUnauthorized: false }
     });

     pool.connect((err) => {
       if (err) {
         console.error("Failed to connect to database:", err.stack);
         return;
       }
       console.log("Successfully connected to database!");
     });

     module.exports = pool;
     ```
   - This code uses `pg` from `package.json`. It connects to PostgreSQL. The `DATABASE_URL` comes from Railway. The `ssl` part makes it safe.

3. **Make Tables**:
   - In `index.js`, add code to make tables:
     ```
     pool.query(`
       CREATE TABLE IF NOT EXISTS categories (
         id SERIAL PRIMARY KEY,
         name VARCHAR(100) NOT NULL,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       )
     `).then(() => console.log("Categories table is ready!"));

     pool.query(`
       CREATE TABLE IF NOT EXISTS products (
         id SERIAL PRIMARY KEY,
         name VARCHAR(100) NOT NULL,
         price INT NOT NULL,
         image BYTEA,
         category_id INT REFERENCES categories(id),
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       )
     `).then(() => console.log("Products table is ready!"));
     ```
   - This makes two tables: one for categories and one for products.

---

**Step 3 – Write Code for Product Listing**

Now, we write the code for listing products. We have two APIs: one to see all products and one to search products.

1. **API to See All Products (`GET /products/all`)**:
   - This API gets all products.
   - Add this code to `index.js`:
     ```
     app.get("/products/all", async (req, res) => {
       try {
         const result = await pool.query(
           "SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC"
         );
         const products = result.rows.map((product) => ({
           ...product,
           image: product.image
             ? `data:image/jpeg;base64,${Buffer.from(product.image).toString("base64")}`
             : null,
         }));
         res.json(products);
       } catch (err) {
         console.error("Error getting products:", err.stack);
         res.status(500).json({ error: "Server error, please try again!" });
       }
     });
     ```
   - This code asks the database for all products. It uses `express` from `package.json` to make the API.

2. **API to Search Products (`GET /products`)**:
   - This API finds products by name or category.
   - Add this code to `index.js`:
     ```
     app.get("/products", async (req, res) => {
       const { search, category_id } = req.query;
       let query =
         "SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1";
       const values = [];
       let paramIndex = 1;

       if (search) {
         query += ` AND p.name ILIKE $${paramIndex}`;
         values.push(`%${search}%`);
         paramIndex++;
       }
       if (category_id) {
         query += ` AND p.category_id = $${paramIndex}`;
         values.push(category_id);
         paramIndex++;
       }

       try {
         const result = await pool.query(query, values);
         const products = result.rows.map((product) => ({
           ...product,
           image: product.image
             ? `data:image/jpeg;base64,${Buffer.from(product.image).toString("base64")}`
             : null,
         }));
         res.json(products);
       } catch (err) {
         console.error("Error searching products:", err.stack);
         res.status(500).json({ error: "Cannot find products, sorry!" });
       }
     });
     ```
   - This code searches products by name (like "áo"). It sends the matching products.

---

**Step 4 – Deploy to Railway**

Now, we put the app on Railway. Here are the steps:

1. **Push Code to GitHub**:
   - Add a `.gitignore` file:
     ```
     node_modules/
     .env
     ```
   - Push the code to GitHub:
     ```
     git init
     git add .
     git commit -m "First project commit"
     git remote add origin https://github.com/kainlee2304/Final_TestDTDM.git
     git push -u origin main
     ```

2. **Make a Project on Railway**:
   - Go to Railway website.
   - Click **New Project**.
   - Choose **GitHub Repo**.
   - Select your repository `kainlee2304/Final_TestDTDM`.

3. **Add Backend Service**:
   - Click **Add Service** > **Empty Service**.
   - Name it `backend`.
   - Set **Root Directory** to `/backend`.
   - Add variables:
     - `PORT`: 4000
     - `NODE_ENV`: production
   - Railway adds `DATABASE_URL` automatically.
   - Click **Deploy**.
   - Railway uses `package.json` to start the app with `npm start`.

4. **Add Frontend Service**:
   - Click **Add Service** > **Empty Service**.
   - Name it `frontend`.
   - Set **Root Directory** to `/frontend`.
   - Add variables:
     - `PORT`: 3000
     - `REACT_APP_API_URL`: `https://backend-production-8551.up.railway.app`
   - Set commands:
     - Build: `npm run build`
     - Start: `npx serve -s build --listen tcp://0.0.0.0:3000`
   - Click **Deploy**.

5. **Add Custom Domain**:
   - In the `frontend` service, click **Networking** > **+ Custom Domain**.
   - Add `app.nguyennt2304.id.vn`.
   - Railway gives a DNS record:
     - Type: `CNAME`
     - Name: `app`
     - Value: `7h251l7p.up.railway.app`
   - Go to Tenten.vn, add this DNS record.
   - Use Cloudflare to make it faster:
     - Add the domain to Cloudflare.
     - Set the same DNS record.
     - Turn on SSL with **Full (strict)**.

---

**Step 5 – Test the App**

Finally, we test the app to see if it works.

1. **Test See All Products**:
   - Open the browser.
   - Go to `https://app.nguyennt2304.id.vn/products/all`.
   - You see a list of products like this:
     ```
     [
       {
         "id": 1,
         "name": "Áo thun",
         "price": 150000,
         "image": "data:image/jpeg;base64,...",
         "category_id": 1,
         "category_name": "Quần áo",
         "created_at": "2025-05-03T12:00:00Z"
       }
     ]
     ```

2. **Test Search Products**:
   - Go to `https://app.nguyennt2304.id.vn/products?search=áo`.
   - You see matching products like this:
     ```
     [
       {
         "id": 1,
         "name": "Áo thun",
         "price": 150000,
         "image": "data:image/jpeg;base64,...",
         "category_id": 1,
         "category_name": "Quần áo",
         "created_at": "2025-05-03T12:00:00Z"
       }
     ]
     ```

---

**Slide 8: Conclusion**

That’s all! We did these steps:
- Set up Node.js and tools with `package.json`.
- Connect to the database with `db.js`.
- Write code for listing and searching products.
- Deploy the app on Railway.
- Test the app with a custom domain.

The app works well. Users can see and search products easily. 

---

