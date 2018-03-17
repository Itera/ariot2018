// PINS
int UP = 2;
int DOWN = 3;

// TABLE CONSTS
const int lowest = 76;
const int highest = 123;
const float cmPerSecond = 4.9;
const int timeFullMovement = 9500;

// SERIAL
String inputString = "";
boolean positionReceived = false;

void setup()
{
  Serial.begin(9600);
  inputString.reserve(3);
  pinMode(UP, OUTPUT);
  pinMode(DOWN, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop()
{
  if (positionReceived) {
    int position = inputString.toInt();

    if(position >= lowest && position <= highest){
      moveTableTo(position);
    }

    // clear the string:
    inputString = "";
    positionReceived = false;
  }
}

void serialEvent() {
  while(Serial.available()) 
   {
      char ch = Serial.read();
      
      if(isDigit(ch)) {
        inputString += ch;
      }
      
      if(ch == '\n') {
        positionReceived = true; 
      }
   }
}

void moveTableTo(int height){
  toBottom();
  moveTable(UP);
  delay(((height-lowest)/cmPerSecond)*1000);
  stopMovement();
}

void toBottom(){
  moveTable(DOWN);
  delay(timeFullMovement);  
  stopMovement();
}

void moveTable(int dir){
  stopMovement();
  digitalWrite(dir, HIGH);
}

void stopMovement(){
  digitalWrite(UP, LOW);
  digitalWrite(DOWN, LOW);
  delay(500);
}

