<?php
/**
 * Created by PhpStorm.
 * User: jillvandendriessche
 * Date: 2/29/16
 * Time: 8:27 PM
 */

/*
 * DISCLAIMER:
 * This file is all kinds of dirty I don't even know where to begin, please NEVER EVER code like this
 * This is for demonstration purposes only, trying to keep an exercise in "Mobile Web Apps" simple, serving no other purpose
 * DO NOT use this code in production. EVER!
 * It is pure evil
 * ~ JVD ~
 * */

$page = (isset($_SERVER['PATH_INFO'])) ? explode('/', $_SERVER['PATH_INFO'])[1] : null;

$db = new PDO(
    'mysql:host=localhost;port=3306;dbname=mobileweb-amazeme',
    'usramazeme',
    'Am@Z3mE'
);

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


function getId($name, $pass, $db)
{ //hier moest ik $db meegeven als parameter, anders wou hij het niet aanvaarden
    try {
        $sql = "SELECT id from user WHERE name=:name and password= :password";
        $stmt = $db->prepare($sql);

        $stmt->execute(array(':name' => $name, ':password' => $pass));
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

    } catch (PDOException $e) {
        json_encode(var_dump($e));
    }

}

switch ($page) {

    case 'register':
        $person = array('name' => htmlentities($_POST['name']), 'email' => $_POST['email'], 'password' => $_POST['password'], 'geolocation' => $_POST['geolocation']);
        try {
            $sql = "INSERT INTO user(name,password,email,geolocation) VALUES(:name,:password,:email,:geolocation);";
            $stmt = $db->prepare($sql);

            json_encode($stmt->execute(array(':name' => $person['name'], ':email' => $person['email'], ':password' => $person['password'], ':geolocation' => $person['geolocation'])));

            echo getId($person['name'], $person['password'], $db);

        } catch (PDOException $e) {
            json_encode(var_dump($e));
        }
        break;

    case 'login':
        $person = array('name' => htmlentities($_POST['name']), 'password' => $_POST['password']);
        try {
            $sql = "SELECT id from user WHERE name=:name and password= :password";
            $stmt = $db->prepare($sql);

            if ($stmt->execute(array(':name' => $person['name'], ':password' => $person['password'])) !== false) {
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                return false;
            }

        } catch (PDOException $e) {
            json_encode(var_dump($e));
        }
        break;

    case 'getcity':
        $person_id = explode('/', $_SERVER['PATH_INFO']);
        if (isset($person_id[2])) {
            $person_id = $person_id[2];
        }
        try {
            $sql = "SELECT * FROM user_city WHERE id=:person_id";
            $params = array(':person_id' => $person_id);

            $stmt = $db->prepare($sql);

            if ($stmt->execute($params) !== false) {
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                return false;
            }
        } catch (PDOException $e) {
            json_encode(var_dump($e));
        }
        break;

    case 'registerCity':
        $person = array('id' => htmlentities($_POST['id']), 'city' => $_POST['city']);
        try {
            $sql = "INSERT INTO user_city(id,city) VALUES(:id,:city)";
            $stmt = $db->prepare($sql);

            echo json_encode($stmt->execute(array(':id' => $person['id'], ':city' => $person['city'])));


        } catch (PDOException $e) {
            json_encode(var_dump($e));
        }
        break;

    case 'removeCityFromUser':
        $person = array('city' => htmlentities($_POST['city']), 'id' => $_POST['id']);
        try {
            $sql = "delete from user_city where id = :id and city = :city";
            $stmt = $db->prepare($sql);

            echo $stmt->execute(array(':id' => $person['id'], ':city' => $person['city']));


        } catch (PDOException $e) {
            json_encode(var_dump($e));
        }
        break;

    case  'editCityOfUser':
        $person = array('id' => $_POST['id'], 'oldCity' => $_POST['oldCity'], 'newCity' => $_POST['newCity']);
        try {
            $sql = "UPDATE user_city SET city = :newCity WHERE id = :id and city = :oldCity";
            $stmt = $db->prepare($sql);

            echo $stmt->execute(array(':newCity' => $person['newCity'], ':id' => $person['id'], ':oldCity' => $person['oldCity']));

        } catch (PDOException $e) {
            json_encode(var_dump($e));
        }
        break;

}

?>