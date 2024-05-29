using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public enum OrderStatusEnum
    {
        [Description("Order Placed")]
        OrderPlaced,

        [Description("Order in Progress")]
        OrderInProgress,

        [Description("Preparing to Ship")]
        PreparingToShip,

        [Description("Shipped")]
        Shipped,

        [Description("Delivered")]
        Delivered

    }
}
