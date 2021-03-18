DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;
USE employeeDB;

/* department */

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

/* role */

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary NUMERIC(12,2) NOT NULL,
  department_id INT,
  PRIMARY KEY (id)
  FOREIGN KEY (department_id)
  REFERENCES department(id)
);

/* employee */

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  
  FOREIGN KEY (role_id)
  REFERENCES role(id)

  FOREIGN KEY (manager_id)
  REFERENCES employee(id)
);

-- seeds

-- department

INSERT INTO department (name)
VALUES ('Engineering'),
('Shipping'),
('Inventory');

-- role

INSERT INTO role (title, salary, department_id)
VALUES ('Principal Engineer', '200000', '1'),
('Sr Engineer', '150000', '1'),
('Engineer II', '100000', '1'),
('Engineer I', '70000', '1'),

('Shipping Manager', '100000', '2'),
('Shipping Clerk', '40000', '2'),
('Shipping Forklift Operator', '30000', '2'),

('Inventory Manager', '100000', '3'),
('Inventory QA', '50000', '3'),
('Inventory Reconciliation', '50000', '3');

-- employee

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Abdur', 'Baxter', '1', null),
('Arooj', 'Bannister', '2', '1'),
('Aniqa', 'Finney', '3', '2'),
('Reon', 'Cline', '4', '3'),

('Jorden', 'Millar', '5', null),
('Shabaz', 'Lim', '6', '5'),
('Chad', 'Connolly', '7', '6'),

('Cecelia', 'Watts', '8', null),
('Aleena', 'Sinclair', '9', '8'),
('Benn', 'Britt', '10', '9');




