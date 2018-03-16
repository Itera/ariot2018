#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN   D3
#define SS_PIN    D4

MFRC522 mfrc522(SS_PIN, RST_PIN);


void setup() {
  Serial.begin(9600);
  SPI.begin();
  mfrc522.PCD_Init();
}


void loop() {
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    printId(mfrc522.uid.uidByte);
    delay(1000);
  }
}


void printId(byte uid[10]) {
  for(int i = 0; i < sizeof(uid); i++)
  {
    Serial.print(uid[i], HEX);
  }
  Serial.println();
}

