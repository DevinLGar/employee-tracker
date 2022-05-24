/* This is importing the dependencies that are needed for the application to run. */
const express = require('express');
const db = require('./db/connection');
const inquirer = require('inquirer');
const table = require('./db/connection');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

const userPrompt = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "menu",
                message: "Pick an option",
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add department",
                    "Add role",
                    "Add employee",
                    "Update employee role",
                    "Quit",
                ],
            },
        ])
        .then((answer) => {
            switch (answer.menu) {
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all employees":
                viewEmployees();
                break;
            case "Add department":
                addDepartment();
                break;
            case "Add role":
                addRole();
                break;
            case "Add employee":
                addEmployee();
                break;
            case "Update employee role":
                updateEmployee();
                break;
            case "Quit":
                db.end() 
                break;
            }
        });
};

function viewDepartments() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.table(res);
      userPrompt();
    });
};

function viewRoles() {
    const sql = `SELECT role.title,
                 role.id,
                 department.name AS department,
                 role.salary FROM role
                 LEFT JOIN department ON department_id = department.id`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        userPrompt();
    });
};

function viewEmployees() {
    const sql = `SELECT employee.id,
                 employee.first_name,
                 employee.last_name,
                 role.title,
                 role.salary,
                 department.name AS department,
                 CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                 FROM employee
                 LEFT JOIN role ON employee.role_id = role.id
                 LEFT JOIN department ON role.department_id = department.id
                 LEFT JOIN employee manager ON manager.id = employee.manager_id`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        userPrompt();
    });
};

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    userPrompt();
});

