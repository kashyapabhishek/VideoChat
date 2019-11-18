using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string caller, string reciver, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage",caller,reciver, message);
        }
    }
}