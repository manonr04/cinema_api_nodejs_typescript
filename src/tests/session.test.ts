describe('SessionService', () => {
  const existingSessions = [
    {
      id: 1,
      startTime: '2025-06-10T18:00:00Z',
      duration: 120,
    },
  ];

  it('should detect overlapping session', () => {
    const newSession = {
      startTime: '2025-06-10T19:00:00Z', // chevauche
      duration: 90,
    };

    const result = hasConflictingScreening(existingSessions[0].id, existingSessions, newSession);
    expect(result).toBe(true);
  });

  /*it('should allow non-overlapping session', () => {
    const newSession = {
      startTime: '2025-06-10T21:30:00Z', // après pub et nettoyage
      duration: 90,
    };

    const result = isSessionOverlapping(existingSessions, newSession);
    expect(result).toBe(false);
  });*/
});
