bookEventHandler = () => {
  if (!this.context.token) {
    this.setState({ selectedEvent: null });
    return;
  }
  const requestBody = {
    query: `
        mutation {
          bookEvent(eventId:"${this.state.selectedEvent._id}") {
            _id
            createdAt
            UpdatedAt
          }
        }
      `,
  };

  fetch("http://localhost:8000/graphql", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.context.token,
    },
  })
    .then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }
      return res.json();
    })
    .then((resData) => {
      console.log(resData);
      this.setState({ selectedEvent: null });
    })
    .catch((err) => {
      console.log(err);
    });
};
