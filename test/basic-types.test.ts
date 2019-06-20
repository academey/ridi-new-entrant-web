describe('Basic Types', () => {
  test('Enum#number', () => {
    enum Color {
      Red,
      Green,
      Blue,
    }
    const c: Color = Color.Green;
    expect(c).toBe(1);
  });

  test('Enum#name', () => {
    enum Color {
      Red = 1,
      Green,
      Blue,
    }
    const colorName: string = Color[2];
    expect(colorName).toBe('Green');
  });
});
