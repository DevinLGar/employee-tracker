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

addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'newDepartment',
                type: 'input',
                message: 'Enter name of department'
            }
        ])
        .then((answer) => {
            const sql = `INSERT INTO department (name) VALUES (?)`;
            db.query(sql, answer.newDepartment, (err, res) => {
                if (err) throw err;
                console.log(answer.newDepartment + ` added`);
                viewDepartments();
            });
        });
};

addRole = () => {
    const sql = `SELECT department.name FROM department`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        departmentChoices = res.map(obj => obj.name)

        inquirer
            .prompt([
                {
                    name: 'newRole',
                    type: 'input',
                    message: 'Enter name of role'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'Enter the salary amount'
                },
                {
                    name: 'department',
                    type: 'list',
                    message: 'Pick a department the role belongs to',
                    choices: departmentChoices
                }
            ])
            .then((answer) => {
                for (i = 0; i < departmentChoices.length; i++) {
                    if (departmentChoices[i] == answer.department) {
                        var departmentId = i + 1
            
                        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
                        const values = [answer.newRole, answer.salary, departmentId]
            
                        db.query(sql, values, (err, res) => {
                        if (err) throw err;
                        console.log(answer.newRole + ` added`);
                        viewRoles();
            
                        });
                    }
                    else {};
                };
            });
    });
};

addEmployee = () => {
    const roleSql = `SELECT role.title FROM role`;
    db.query(roleSql, (err, res) => {
      if (err) throw err;
      roleChoices = res.map(obj => obj.title)
  
      const employeeSql =`SELECT employee.id, 
                          employee.first_name, 
                          employee.last_name FROM employee`;
      db.query(employeeSql, (err, res) => {
        if (err) throw err;
        managerChoices = res.map(obj => obj.first_name + " " + obj.last_name)
        /* Adding the string "None" to the end of the array. */
        managerChoices.push("None");
  
        inquirer
            .prompt([
                {
                    name: 'newEmployeeFirstName',
                    type: 'input',
                    message: 'Enter first name'
                },
                {
                    name: 'newEmployeeLastName',
                    type: 'input',
                    message: 'Enter last name'
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'Pick a role',
                    choices: roleChoices
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: 'Pick a manager',
                    choices: managerChoices
                }
            ])
            .then((answer) => {
                for (i = 0; i < res.length; i++) {
                    if (answer.manager == (res[0].first_name + " " + res[0].last_name)) {
                        managerId = i + 1;
                        for (i = 0; i < roleChoices.length; i++) {
                            if (roleChoices[i] == answer.role) {
                                var roleId = i + 1
                                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
                                const values = [answer.newEmployeeFirstName, answer.newEmployeeLastName, roleId, managerId]
                                db.query(sql, values, (err, res) => {
                                if (err) throw err;
                                console.log(answer.newEmployeeFirstName + ` ` + answer.newEmployeeLastName + ` added`);
                                viewEmployees();
                                });
                            }
                        }
                    }
                    else if (answer.manager == "None") {
                        managerId = null;
                        for (i = 0; i < roleChoices.length; i++) {
                            if (roleChoices[i] == answer.role) {
                                var roleId = i + 1;
                                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
                                const values = [answer.newEmployeeFirstName, answer.newEmployeeLastName, roleId, managerId]
                                db.query(sql, values, (err, res) => {
                                if (err) throw err;
                                console.log(answer.newEmployeeFirstName + ` ` + answer.newEmployeeLastName + ` added`);
                                viewEmployees();
                                });
                            }
                        };
                    }
                };
            });
      })
    })
}

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    userPrompt();
});

