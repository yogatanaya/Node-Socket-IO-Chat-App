<?php 

error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__ . '/vendor/autoload.php';

use ElephantIO\Client as Elephant;
use ElephantIO\Engine\SocketIO\Version2X as Version2X;

try {

  
  $elephant = new Elephant(new Version2X("http://localhost:5000"));
 
  $elephant->initialize();

  $elephant->emit('joinRoom', 
    array('username' => 'sys_admin', 'room' => 'Room A' )
  );

  $elephant->emit('chatMessage', array('Hello everyone...'));

  // $elephant->send(
  //   ElephantIOClient::TYPE_EVENT,
  //   null,
  //   null,
  //   json_encode(array('name' => 'joinRoom', 'args' => array('user' => 'sys_admin', 'room' => 'Room A' )));
  // );
  
  // $elephant->send(
  //   ElephantIOClient::TYPE_EVENT,
  //   null,
  //   null,
  //   json_encode(array('name' => 'chatMessage', 'args' => 'Hello ...' )));
  // );
  
  
  // $elephant->send(
  //   ElephantIOClient::TYPE_EVENT,
  //   null,
  //   null,
  //   json_encode(array('name' => 'disconnect' )));
  // );
  
  $elephant->close();
  
  echo 'trying to send `bar` to the event `foo`';  
} catch (\Exception $e) {
  echo 'Error '.$e->getMessage();
}
