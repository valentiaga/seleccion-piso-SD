#include <SPI.h>
#include <MFRC522.h>
#define RST_PIN         16          // Configurable, see typical pin layout above
#define SS_PIN          5         // Configurable, see typical pin layout above
MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance

#include <WiFi.h>
#include <PubSubClient.h>

// Update these with values suitable for your network.
const char* ssid = "Fibertel WiFi007 2.4GHz";
const char* password = "0044245540";

const char* mqtt_server = "test.mosquitto.org";

WiFiClient espClient;
PubSubClient client(espClient);


void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);

  // WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());

  Serial.println("");
  Serial.println("Conectado a WiFi");
  Serial.println("Dirección IP: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
  
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Intentando conectar al servidor MQTT ...");
    // Create a random client ID
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str(),"rw", "readwrite")) {
      Serial.println("Conectado");
      // Once connected, publish an announcement...
      client.publish("/outTopic/", "Conectado MQTT");
      // ... and resubscribe
      client.subscribe("/inTopic/");
    } else {
      Serial.print("Fallo en la conexión, rc=");
      Serial.print(client.state());
      Serial.println("Reintentando en 5 segundos");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
	Serial.begin(9600);		// Initialize serial communications with the PC
	SPI.begin();			// Init SPI bus
	mfrc522.PCD_Init();		// Init MFRC522
	delay(4);				// Optional delay. Some board do need more time after init to be ready, see Readme
	setup_wifi();
  client.setServer(mqtt_server, 1884);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
   
      String ID="";

      for (byte i = 0; i < mfrc522.uid.size; i++) {
          ID += String(mfrc522.uid.uidByte[i], HEX);         
      } 

      Serial.print("Tarjeta ID:");
      Serial.println(ID);
      
      //publica el id en el mosquitto
      client.publish("/ssdd2023/visitante/",ID.c_str());
      // Detiene la lectura para que no se repita
      mfrc522.PICC_HaltA();
  }
  delay(1000);
}

