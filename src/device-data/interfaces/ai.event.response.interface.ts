export interface AIEventResponse {
  data: {
    events: [
      {
        hitTime: number;
        value: {
          acc: number;
          kur: number;
          min: number;
          max: number;
        };
      },
    ];
  };
}
