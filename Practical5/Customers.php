<?php
header('Content-Type: application/json');

$customers = [
    ['id' => 1, 'name' => 'Yash', 'email' => 'Yash@example.com', 'phone' => '123-456-7890', 'address' => 'Mumbai, India', 'company' => 'Tech Corp'],
    ['id' => 2, 'name' => 'Priyanshu', 'email' => 'Priyanshu@example.com', 'phone' => '976-775-9748', 'address' => 'Delhi, India', 'company' => 'Web Solutions'],
    ['id' => 3, 'name' => 'Rishi', 'email' => 'Rishi@example.com', 'phone' => '836-433-8830', 'address' => 'Bangalore, India', 'company' => 'InnovateX'],
    ['id' => 4, 'name' => 'Karan', 'email' => 'Karan@example.com', 'phone' => '347-425-9876', 'address' => 'Hyderabad, India', 'company' => 'CyberTech'],
    ['id' => 5, 'name' => 'Aman', 'email' => 'Aman@example.com', 'phone' => '647-132-9587', 'address' => 'Pune, India', 'company' => 'SoftWorks']
];

echo json_encode($customers);
?>
