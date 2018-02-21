const { add, subtract, multiply, divide } = require("./calculator");

describe("valid additions", () => {
  test("1 + 1 = 2", () => {
    expect(add(1, 1)).toEqual(2);
  });

  test("10 + 20 = 30", () => {
    expect(add(10, 20)).toEqual(30);
  });
});

describe("valid subtractions", () => {
  test("10 - 2 = 8", () => {
    expect(subtract(10, 2)).toEqual(8);
  });

  test("87 - 523 = -436", () => {
    expect(subtract(87, 523)).toEqual(-436);
  });
});

