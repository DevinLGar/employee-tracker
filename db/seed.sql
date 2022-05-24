INSERT INTO department (name)
VALUES 
('Grocery'),
('Ecommerce'),
('Prepared Foods');

INSERT INTO role (title, salary, department_id)
VALUES
('Grocery Team Leader', 60000, 1),
('Assistant Team Leader', 40000, 1),
('Grocery Team Member', 34000, 1),
('Store Shopper', 33000, 2),
('Supervisor', 40000, 2),
('Prepared Foods Team Leader', 60000, 3),
('Order Writer', 40000, 3),
('Prepared Foods Team Member', 34000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Ronald', 'Firbank', 1, null),
('Virginia', 'Woolf', 2, 1),
('Piers', 'Gaveston', 3, 1),
('Charles', 'LeRoi', 4, 5),
('Katherine', 'Mansfield', 5, null),
('Dora', 'Carrington', 6, null),
('Edward', 'Bellamy', 7, null),
('Montague', 'Summers', 8, 7);