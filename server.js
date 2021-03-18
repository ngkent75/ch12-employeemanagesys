// Establish requires
const mysql = require('mysql');
const inquirer = require('inquirer');
const { restoreDefaultPrompts } = require('inquirer');
require('console.table');

// Create connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'employeeDB'
});

// Variables/arrays
// const employeeArr = [];
// const departmentArr = [];
// const roleArr = [];

// Function that starts prompt and asks for the user's first action
const init = () => {
  inquirer
    .prompt({
      name: 'firstAction',
      type: 'list',
      message: 'What would you like to do?',
      choices: ['ADD', 'VIEW', 'UPDATE ROLE', 'EXIT']
    })
    .then((answer) => {
      switch (answer.firstAction) {
        case 'ADD':
          add();
          break;
        case 'VIEW':
          view();
          break;
        case 'UPDATE ROLE':
          updateRole();
          break;
        default:
          connection.end();
      }
    });
};

// Function that asks user what they would like to add
const add = () => {
  inquirer
    .prompt({
      name: 'addition',
      type: 'list',
      message: 'What would you like to add?',
      choices: ['DEPARTMENT', 'ROLE', 'EMPLOYEE', 'EXIT']
    })
    .then((answer) => {
      switch (answer.addition) {
        case 'DEPARTMENT':
          addDepartment();
          break;
        case 'ROLE':
          addRole();
          break;
        case 'EMPLOYEE':
          addEmployee();
          break;
        default:
          connection.end();
      }
    });
};

// Function that asks user what they would like to view in a prompt
const view = () => {
  inquirer
    .prompt({
      name: 'viewing',
      type: 'list',
      message: 'What would you like to view?',
      choices: ['DEPARTMENT', 'ROLE', 'EMPLOYEE', 'EXIT']
    })
    .then((answer) => {
      switch (answer.viewing) {
        case 'DEPARTMENT':
          viewDepartment();
          break;
        case 'ROLE':
          viewRole();
          break;
        case 'EMPLOYEE':
          viewEmployee();
          break;
        default:
          connection.end();
          console.log('End');
      }
    });
};

// Function that updates the role of an employee in a prompt
const updateRole = () => {
  connection.query('SELECT * FROM role', (err, roleResults) => {
    if (err) throw err;
    connection.query('SELECT * FROM employee', (err, employeeResults) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: 'roleEmployee',
            type: 'list',
            message: 'Who\'s role would you like to update?',
            choices: () => employeeResults.map((item) => {
              return { name: item.first_name, value: item.id }
            })
          },
          {
            name: 'roleUpdate',
            type: 'list',
            message: 'What would you like to update their role to?',
            choices: () => roleResults.map((item) => {
              return { name: item.title, value: item.id }
            })
          }
        ])
        // TODO: Update role of employee
        .then((answer) => {
          connection.query(
            'UPDATE employee SET ? WHERE ?',
            [
              {
                role_id: answer.roleUpdate
              },
              {
                id: answer.roleEmployee
              }
            ],
            (err) => {
              if (err) throw err;
              console.log('Updated the role of ' + answer.roleEmployee + ' to ' + answer.roleUpdate);
              init();
            }
            )
          })
    })
  })
};

// Function that adds a department in a prompt
const addDepartment = () => {
  inquirer
    .prompt({
      name: 'departmentName',
      type: 'input',
      message: 'What is the NAME of the department you would like to add?',
    })
    .then((answer) => {
      connection.query(
        'INSERT INTO department SET ?',
        {
          name: answer.departmentName
        },
        (err) => {
          if (err) throw err;
          console.log('Added ' + answer.departmentName + ' as a department');
          init();
        }
      )
    })
};

// Function that adds a role in a prompt
const addRole = () => {
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: 'roleTitle',
          type: 'input',
          message: 'What is the TITLE of the role you would like to add?'
        },
        {
          name: 'roleSalary',
          type: 'input',
          message: 'What is the SALARY of the role you would like to add?'
        },
        {
          name: 'roleDepartment',
          type: 'list',
          message: 'What is the DEPARTMENT of the role you would like to add?',
          choices: () => results.map((item) => {
            return { name: item.name, value: item.id }
          })
        }
      ])
      // TODO: Add role
      .then((answer) => {
        connection.query(
          'INSERT INTO role SET ?',
          {
            title: answer.roleTitle,
            salary: answer.roleSalary,
            department_id: answer.roleDepartment
          },

          (err) => {
            if (err) throw err;
            console.log(answer.roleTitle + ' will be added to the ' + answer.roleDepartment + ' department with a salary of ' + answer.roleSalary);
            init();
          }
        )
      });
  })
};



// Function that adds an employee in a prompt
const addEmployee = () => {
  connection.query('SELECT * FROM role', (err, roleResults) => {
    if (err) throw err;
    connection.query('SELECT * FROM employee', (err, employeeResults) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: 'firstName',
            type: 'input',
            message: 'What is the first name of the employee you would like to add?',
          },
          {
            name: 'lastName',
            type: 'input',
            message: 'What is the last name of the employee you would like to add?',
          },
          {
            name: 'employeeRole',
            type: 'list',
            message: 'What is the role of the employee you would like to add?',
            choices: () => roleResults.map((item) => {
              return { name: item.title, value: item.id }
            })
          },
          {
            name: 'employeeManager',
            type: 'list',
            message: 'Who is the manager of the employee you would like to add?',
            choices: () => employeeResults.map((item) => {
              return { name: (item.first_name + ' ' + item.last_name), value: item.id }
            })
          }
        ])
        // TODO: Add employee. Make the manager optional
        .then((answer) => {
          connection.query(
            'INSERT INTO employee SET ?',
            {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: answer.employeeRole,
              manager_id: answer.employeeManager
            },
            (err) => {
              if (err) throw err;
              console.log(answer.firstName + ' ' + answer.lastName + ' will be added with the role of ' + answer.employeeRole + ' and their manager will be ' + answer.employeeManager);
              init();
            })
        });
    });
  })};



// Function that views emloyee
const viewEmployee = () => {
  connection.query('SELECT employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id', (err, employeeResults) => {
    if (err) throw err;
    console.table(employeeResults);
    init();
  })
};

// Function that views a role
const viewRole = () => {
  connection.query('SELECT role.title, department.name, role.salary FROM role INNER JOIN department ON department.id = role.department_id', (err, roleResults) => {
    if (err) throw err;
    console.table(roleResults);
    init();
  })
};

// Function that views department
const viewDepartment = () => {
  connection.query('SELECT department.name FROM department', (err, roleResults) => {
    if (err) throw err;
    console.table(roleResults);
    init();
  })
};

// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  // run the init function after the connection is made to prompt the user
  init();
});