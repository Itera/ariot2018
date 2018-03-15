int UP = 4;   // D2 (NodeMCU)
int DOWN = 5; // D1 (NodeMCU)

void setup()
{
  pinMode(UP, OUTPUT);
  pinMode(DOWN, OUTPUT);
}

void loop()
{
  moveTable(UP);
  delay(1000);
  moveTable(DOWN);
  delay(1000);
  stopMovement();
  delay(1000);
}

void moveTable(int dir){
  int oppositeDir = dir == UP ? DOWN : UP;
  
  digitalWrite(oppositeDir, LOW);
  delay(500);
  digitalWrite(dir, HIGH);
}

void stopMovement(){
  digitalWrite(UP, LOW);
  digitalWrite(DOWN, LOW);
}

