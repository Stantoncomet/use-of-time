import websockets
import asyncio

x=0
delay=5000
# Creating WebSocket server
async def ws_server(websocket):
    print("WebSocket: Server Started.")
 
    try:
        while True:
            global x
            x+=1
            msg = "Calc.setExpression({id: '1',latex: 'y=x',color: Desmos.Colors.BLUE});"
            if x % delay == 0:
                #print(f"x{x/delay} sending...")
                await websocket.send(msg)

 
    except websockets.ConnectionClosedError:
        print("Internal Server Error.")
 
 
async def main():
    async with websockets.serve(ws_server, "localhost", 7000):
        await asyncio.Future()  # run forever
 
if __name__ == "__main__":
    asyncio.run(main())