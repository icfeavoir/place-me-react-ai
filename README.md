# Place group of people using GA (Genetic Algorithm)

const fatherPlan: Plan;
const motherPlan: Plan;
const childPlan: Plan = new Plan();

let isFatherTurn = Math.random() < 0.5;

const groups = [...fatherPlan.groups];
let remainingGroups = [...groups];
const groupsToPlace = []; 

groups.foreach((group) => {
  let usedPlan: Plan = isFatherTurn ? fatherPlan : motherPlan;
  
  const seats = usedPlan.getGroupSeats(group);

  <!-- check if all seats are available -->
  const canPlaceGroup = seats.every((seat) => !childPlan.isSeatAvailable(seat));

  if (canPlaceGroup) {
    childPlan.placeGroup(group, seats);
    remainingGroups = remainingGroups.filter((g) => g !== group);
  } else {
    groupsToPlace.push(group);
  }

  isFatherTurn = !isFatherTurn;
})

<!-- put groups that have not been placed -->

