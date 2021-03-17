// Establish requires
const mysql = require('mysql');
const inquirer = require('inquirer');

// Create connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'employeeDB'
});

// Variables/arrays
const employeeArr = ['Employee1', 'Employee2', 'Employee3'];
const departmentArr = ['Department1', 'Department2', 'Department3'];
const roleArr = ['Role1', 'Role2', 'Role3'];

// Function that starts prompt and asks for the user's first action
const start = () => {
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
        default:
          connection.end();
      }
    });
};

// Function that updates the role of an employee in a prompt
const updateRole = () => {
  inquirer
    .prompt([
      {
        name: 'roleEmployee',
        type: 'list',
        message: 'Who\'s role would you like to update?',
        choices: employeeArr
      },
      {
        name: 'roleUpdate',
        type: 'list',
        message: 'What would you like to update their role to?',
        choices: roleArr
      }
    ])
    // TODO: Update role of employee
    .then((answer) => {
      console.log('Updated the role of ' + answer.roleEmployee + ' to ' + answer.roleUpdate);
      start();
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
    // TODO: Add department
    .then((answer) => {
      console.log('Added ' + answer.departmentName + ' as a department');
      start();
    })
};

// Function that adds a role in a prompt
const addRole = () => {
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
        choices: departmentArr
      }
    ])
    // TODO: Add role
    .then((answer) => {
      console.log(answer.roleTitle + ' will be added to the ' + answer.roleDepartment + ' department with a salary of ' + answer.roleSalary);
      start();
    });
};

// Function that adds an employee in a prompt
const addEmployee = () => {
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
        choices: roleArr
      },
      {
        name: 'employeeManager',
        type: 'list',
        message: 'Who is the manager of the employee you would like to add?',
        choices: employeeArr
      }
    ])
    // TODO: Add employee. Make the manager optional
    .then((answer) => {
      console.log(answer.firstName + ' ' + answer.lastName + ' will be added with the role of ' + answer.employeeRole + ' and their manager will be ' + answer.employeeManager);
      start();
    })
};

// Function that views a department in a prompt
const viewDepartment = () => {
  inquirer
    .prompt({
      name: 'departmentView',
      type: 'list',
      message: 'Which department would you like to view?',
      choices: departmentArr
    })
    // TODO: display table for department
    .then((answer) => {
      console.log('You are now viewing a table for the ' + answer.departmentView + ' department');
      start();
    })
};

// Function that views a role in a prompt
const viewRole = () => {
  inquirer
    .prompt({
      name: 'roleView',
      type: 'list',
      message: 'Which role would you like to view?',
      choices: roleArr
    })
    // TODO: display table for role
    .then((answer) => {
      console.log('You are now viewing a table for the ' + answer.roleView + ' role');
      start();
    })
};

// Function that views an employee in a prompt
const viewEmployee = () => {
  inquirer
    .prompt({
      name: 'employeeView',
      type: 'list',
      message: 'Which employee would you like to view?',
      choices: employeeArr
    })
    // TODO: display table for role
    .then((answer) => {
      console.log('You are now viewing a table for ' + answer.employeeView);
      start();
    })
};

// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});