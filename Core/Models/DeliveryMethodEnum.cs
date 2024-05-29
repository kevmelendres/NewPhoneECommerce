using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public enum DeliveryMethodEnum
    {
        [Description("Order Placed")]
        SameDayDelivery,

        [Description("Order in Progress")]
        OvernightDelivery,

        [Description("Preparing to Ship")]
        NormalDelivery,

        [Description("Saver Delivery")]
        SaverDelivery,
    }
}
