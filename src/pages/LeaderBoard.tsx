import { Table } from "react-bootstrap";
import server from "../server";
import { useNavigate } from "react-router-dom";

const FS = screen.height > screen.width ? "vw" : "vh";

function LeaderBoard() {
  const navigate = useNavigate();

  return (
    <>
      <button
        type="button"
        onClick={() => {
          server.start();
          navigate("/");
        }}
        className="bg-gray-800"
        style={{
          color: "gold",
          fontSize: `6${FS}`,
          fontFamily: "starjhol",
          border: "4px solid black",
          padding: `0 2${FS}`,
          margin: `2${FS}`,
          textAlign: "center",
          borderRadius: "10px",
        }}
      >
        Play
      </button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>time</th>
          </tr>
        </thead>
        <tbody>
          {server.leaderBoard.value.map((player, rank) => {
            let time = "error";
            if (player.time) {
              time = new Date(player.time).toISOString().slice(11, 19);
            }
            return (
              <>
                <tr>
                  <td>{rank + 1}</td>
                  <td>{player.name}</td>
                  <td>{time}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}

export default LeaderBoard;
