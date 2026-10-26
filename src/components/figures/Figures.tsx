import FigureCanvas from "./FigureCanvas";
import { createActionSpaceScene } from "./actionSpaceScene";
import { createFleetScene } from "./fleetScene";
import { createPolytopeScene } from "./polytopeScene";

export const ActionSpaceFigure = () => (
  <FigureCanvas
    createScene={createActionSpaceScene}
    label="Interactive illustration of a discrete action space: a box around a moving proto-action contains many valid actions, a few are drawn based on their distance to the proto-action and scored by the critic, and the sample with the highest value is selected."
    caption={
      <>
        A toy action space. The dark dot is the actor's proto-action (move your cursor). Of the valid actions in the
        box around it (gray), only K = 4 are drawn based on their distance to the proto-action, redrawn over time, and scored by the critic (numbers).
        The highest-valued sample, not the nearest action, is executed (ringed). Values are random stand-ins for Q.
      </>
    }
  />
);

export const FleetFigure = () => (
  <FigureCanvas
    createScene={createFleetScene}
    label="Animated illustration of an autonomous mobility-on-demand system on a hexagonal grid: customers appear, vehicles drive to them, pick them up, transport them and drop them off, and the running profit is shown as the global reward."
    caption={
      <>
        Fleet dispatching on a hexagonal grid. Customers appear (rings count down their patience), a central matching
        assigns each to the nearest idle vehicle, which picks them up, drives them to their destination (square) and
        drops them off. Move your cursor to create a demand hotspot. The counter is the shared global reward.
      </>
    }
  />
);

export const PolytopeFigure = () => (
  <FigureCanvas
    createScene={createPolytopeScene}
    label="Interactive illustration of a feasible polytope: the vertex that maximizes the inner product with the score vector theta is selected, and the shaded normal cone shows which scores map to it."
    caption={
      <>
        A combinatorial action space as a polytope. The actor outputs scores θ (move your cursor); the
        optimization layer returns the vertex maximizing θ·y, so the action is always feasible. Shaded: the
        normal cone of scores that map to that vertex.
      </>
    }
  />
);
