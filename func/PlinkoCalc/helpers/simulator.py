import struct
from random import random
from pymunk import Space, Body, Circle

SPACE_SIZE = 1000


class PlinkoSimulation:
    space: Space
    pegs: list[Circle]
    balls: list[Circle]
    scored: list[Circle]

    ball_radius: int
    peg_radius: int
    peg_rows: int
    pegs_per_row: int
    win_width: int

    def peg_pos(self, row: int, peg: int) -> tuple[float, float]:
        x_gap_size = SPACE_SIZE / self.pegs_per_row
        y_gap_size = SPACE_SIZE / self.peg_rows

        odd_row_offset = x_gap_size / 2 * (row % 2)

        return (
            peg * x_gap_size + odd_row_offset,
            -row * (y_gap_size),
        )

    def __init__(
        self,
        ball_count: int = 100,
        ball_radius: int = 10,
        peg_rows: int = 20,
        pegs_per_row: int = 20,
        peg_radius: int = 10,
        win_width: int = 100,
    ):
        self.space = Space()
        self.space.gravity = 0, -300

        self.ball_radius = ball_radius
        self.peg_rows = peg_rows
        self.pegs_per_row = pegs_per_row
        self.peg_radius = peg_radius
        self.win_width = win_width

        self.pegs = []
        self.balls = []
        self.scored = []

        # Create pegs
        for row in range(peg_rows):
            for peg in range(pegs_per_row - row % 2):
                body = Body(body_type=Body.KINEMATIC)
                body.position = self.peg_pos(row, peg)

                shape = Circle(body, peg_radius)
                shape.elasticity = 1

                self.space.add(body, shape)
                self.pegs.append(shape)

        # Create balls
        for _ in range(ball_count):
            body = Body()
            body.position = ((SPACE_SIZE / 4) + random() * (SPACE_SIZE / 2), 50)

            shape = Circle(body, ball_radius)
            shape.density = 1
            shape.elasticity = 0.4

            self.space.add(body, shape)
            self.balls.append(shape)

    def check_scored(self, ball: Circle):
        center = (SPACE_SIZE - (SPACE_SIZE / self.pegs_per_row)) / 2

        if abs(ball.body.position.x - center) < self.win_width / 2:
            return True

        return False

    def step(self):
        for _ in range(2):
            self.space.step(1 / 60)

        to_remove = []

        for ball in self.balls:
            if ball.body.position.y < -SPACE_SIZE - 100:
                self.space.remove(ball, ball.body)
                to_remove.append(ball)
                continue

            if ball.body.position.y < -SPACE_SIZE - 20 and ball not in self.scored:
                if self.check_scored(ball):
                    self.scored.append(ball)
                    continue

        for ball in to_remove:
            self.balls.remove(ball)

        return [{"x": _.body.position.x, "y": _.body.position.y} for _ in self.balls]


if __name__ == "__main__":
    balls = 1000
    sim = PlinkoSimulation(ball_count=balls)

    with open("sim.bin", "wb") as f:
        # Write an unsigned 32-bit integer for the number of pegs
        total_pegs = len(sim.pegs)
        f.write(struct.pack("I", total_pegs))

        # Write the pegs 2 32-bit floats for each peg
        for peg in sim.pegs:
            x = peg.body.position.x
            y = peg.body.position.y

            f.write(struct.pack("f", x))
            f.write(struct.pack("f", y))

        # Calculate the frames
        frames = []
        frame_count = 0
        while len(sim.balls) > 0 and frame_count < 3000:
            frames.append(sim.step())

            frame_count += 1

        if frame_count == 3000:
            print("Simulation timed out")

        print(f"Scored: {len(sim.scored)} out of {balls} ({len(sim.scored) / balls * 100}%)")

        # Write an unsigned 32-bit integer for the number of frames
        f.write(struct.pack("I", len(frames)))

        # Write the frames
        for frame in frames:
            # Write an unsigned 32-bit integer for the number of balls in this frame
            f.write(struct.pack("I", len(frame)))

            for ball in frame:
                f.write(struct.pack("f", ball["x"]))
                f.write(struct.pack("f", ball["y"]))
