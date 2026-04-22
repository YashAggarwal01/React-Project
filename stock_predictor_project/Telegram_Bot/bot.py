from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, ConversationHandler, filters, ContextTypes

# States
RISK, ENTRY, SL, TP = range(4)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 Welcome to *Swing Trade Position Calculator!*\n\n"
        "I'll calculate the exact quantity to buy based on your risk.\n\n"
        "💰 Enter your *Risk Amount* (in ₹):",
        parse_mode="Markdown"
    )
    return RISK

async def get_risk(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['risk'] = float(update.message.text)
    await update.message.reply_text("📥 Enter your *Entry Price* (₹):", parse_mode="Markdown")
    return ENTRY

async def get_entry(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['entry'] = float(update.message.text)
    await update.message.reply_text("🛑 Enter your *Stop Loss* (₹):", parse_mode="Markdown")
    return SL

async def get_sl(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['sl'] = float(update.message.text)
    await update.message.reply_text("🎯 Enter your *Target Price* (₹):", parse_mode="Markdown")
    return TP

async def get_tp(update: Update, context: ContextTypes.DEFAULT_TYPE):
    tp = float(update.message.text)
    risk = context.user_data['risk']
    entry = context.user_data['entry']
    sl = context.user_data['sl']

    risk_per_share = entry - sl
    quantity = int(risk / risk_per_share)
    potential_profit = (tp - entry) * quantity
    total_investment = entry * quantity
    rr_ratio = round((tp - entry) / (entry - sl), 2)

    await update.message.reply_text(
        f"📊 *Trade Summary*\n\n"
        f"━━━━━━━━━━━━━━━━\n"
        f"📥 Entry      : ₹{entry}\n"
        f"🛑 Stop Loss  : ₹{sl}\n"
        f"🎯 Target     : ₹{tp}\n"
        f"━━━━━━━━━━━━━━━━\n"
        f"📦 Quantity   : *{quantity} shares*\n"
        f"💸 Risk Amount: ₹{risk}\n"
        f"💰 Est. Profit: ₹{potential_profit}\n"
        f"📈 R:R Ratio  : {rr_ratio}\n"
        f"🏦 Capital Needed: ₹{total_investment}\n"
        f"━━━━━━━━━━━━━━━━\n\n"
        f"Type /start to calculate again.",
        parse_mode="Markdown"
    )
    return ConversationHandler.END

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("❌ Cancelled. Type /start to begin again.")
    return ConversationHandler.END

app = ApplicationBuilder().token("8233343837:AAHg2d6yQAK4n1OH5wrVXRZLWSkFvWE4hh4").build()

conv_handler = ConversationHandler(
    entry_points=[CommandHandler("start", start)],
    states={
        RISK: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_risk)],
        ENTRY: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_entry)],
        SL: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_sl)],
        TP: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_tp)],
    },
    fallbacks=[CommandHandler("cancel", cancel)]
)

app.add_handler(conv_handler)
print("Bot is running...")
app.run_polling()