<?php


class GetResponse {
    public $apiKey = 'PASS_API_KEY_WHEN_INSTANTIATING_CLASS';
    private $apiURL = 'https://api.getresponse.com/v3';
    private $addcontacturl = 'https://api.getresponse.com/v3/contacts/';

    public function __construct($apiKey = null) {
        if(!extension_loaded('curl')) trigger_error('GetResponsePHP requires PHP cURL', E_USER_ERROR);
        if(is_null($apiKey)) trigger_error('API key must be supplied', E_USER_ERROR);
        $this->apiKey = $apiKey;
    }

    public function addContact($campaign, $name, $email, $action = 'standard', $cycle_day = 0, $customs = array()) {
        $data = array (
            'name' => $name,
            'email' => $email,
            'dayOfCycle' => $cycle_day,
            'campaign' => array('campaignId'=>$campaign),  // Your Valid Email e.g. ThwHa
            'ipAddress'=>  $_SERVER['REMOTE_ADDR'], // $_SERVER['REMOTE_ADDR']
        );
        if(!empty($customs)) {
            foreach($customs as $key => $val) $c[] = array('name' => $key, 'content' => $val);
            $data['customs'] = $c;
        }
        $data_string = json_encode($data);
        $ch = curl_init($this->addcontacturl);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'X-Auth-Token: api-key '.$this->apiKey,
            )
        );

        $result = curl_exec($ch); // Print this If you want to verfify

        $response = json_decode($result);

        curl_close($ch);
        if(!empty($response->message)){
            return array(
                'msg' => $response->message,
                'result' => false
            );
        }else{
            return array(
                'msg' => $response->message,
                'result' => true
            );
        }


    }
}


?>
