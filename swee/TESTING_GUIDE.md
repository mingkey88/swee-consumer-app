# 🧪 Bella Beauty Studio - Complete Testing Guide

## 🎯 Overview
This guide provides a comprehensive test flow for Bella Beauty Studio, our featured merchant on the Swee consumer app. All data is real and stored in the database.

## 📊 Test Data Summary

### 🏢 **Bella Beauty Studio**
- **ID:** 1
- **Owner:** Bella Chen (bella@bellabeauty.com)
- **Location:** 123 Orchard Road, #02-45, Singapore 238858
- **Phone:** +65 6123 4567
- **Trust Score:** 4.8
- **Services:** 8 premium beauty services
- **Reviews:** 1 real customer review (5-star)

### 🛍️ **Available Services**
1. **Signature Hair Cut & Style** - $85.00 (90 min)
2. **Premium Hair Coloring** - $150.00 (180 min)
3. **Keratin Hair Treatment** - $180.00 (150 min)
4. **Hydrating Facial Deluxe** - $120.00 (75 min)
5. **Acne Treatment Facial** - $100.00 (60 min)
6. **Anti-Aging Facial** - $160.00 (90 min)
7. **Eyebrow Shaping & Tinting** - $65.00 (45 min)
8. **Eyelash Extensions** - $120.00 (120 min)

### 👥 **Test Customers**
1. **Sarah Chen** - sarah.chen@email.com (150 points)
2. **Maria Rodriguez** - maria.rodriguez@email.com (220 points)
3. **Jessica Wong** - jessica.wong@email.com (350 points)

## 🔗 **Test URLs**

### 🏠 **Landing Page**
```
http://localhost:3001/
```
**Test:** Look for "Bella Beauty Studio" in the "Popular near you" section

### 🔍 **Search API**
```
http://localhost:3001/api/search?query=bella
http://localhost:3001/api/search?category=beauty
```

### 🏢 **Provider Detail Page**
```
http://localhost:3001/providers/1
```

### 📊 **Merchant API**
```
http://localhost:3001/api/merchants/1
```

### 📅 **Booking API**
```
http://localhost:3001/api/bookings
```

## 🧪 **Complete Test Flow**

### **Step 1: Landing Page Discovery**
1. Visit `http://localhost:3001/`
2. ✅ **Verify:** Bella Beauty Studio appears in "Popular near you"
3. ✅ **Check:** Rating shows 4.8 stars
4. ✅ **Check:** "From $65" pricing
5. ✅ **Check:** Tags show "Hair", "Facial", "Brows"

### **Step 2: Provider Detail Page**
1. Click on Bella Beauty Studio card OR visit `http://localhost:3001/providers/1`
2. ✅ **Verify:** Hero section loads with studio info
3. ✅ **Check:** Trust score displays (4.8)
4. ✅ **Check:** Real address and contact info shows
5. ✅ **Check:** All 8 services are listed with real prices
6. ✅ **Check:** Sarah Chen's 5-star review appears
7. ✅ **Check:** Service tags are displayed (dry_hair, damaged_hair, etc.)

### **Step 3: Service Selection**
1. Click on "Signature Hair Cut & Style" ($85.00)
2. ✅ **Verify:** Service highlights with orange border
3. ✅ **Check:** "Selected" indicator appears
4. ✅ **Check:** Booking summary shows correct details
5. ✅ **Check:** Price and duration display correctly

### **Step 4: Booking Flow**
1. Select a future date
2. Choose an available time slot (e.g., "10:00 AM")
3. ✅ **Verify:** Booking summary updates
4. ✅ **Check:** Total price shows $85.00
5. ✅ **Check:** Duration shows 1h 30m
6. Click "Book Appointment"
7. ✅ **Verify:** Navigates to confirmation page

### **Step 5: Search Functionality**
1. Visit `http://localhost:3001/search?query=bella`
2. ✅ **Verify:** Bella Beauty Studio appears in results
3. ✅ **Check:** Real services and pricing display
4. Try different search terms:
   - "hair treatment"
   - "facial"
   - "beauty studio"

### **Step 6: API Testing**
1. **Merchant Data API:**
   ```bash
   curl http://localhost:3001/api/merchants/1
   ```
   ✅ **Expected:** Complete merchant object with services and reviews

2. **Search API:**
   ```bash
   curl "http://localhost:3001/api/search?query=bella"
   ```
   ✅ **Expected:** Array with Bella Beauty Studio

3. **Booking Creation:**
   ```bash
   curl -X POST http://localhost:3001/api/bookings \
   -H "Content-Type: application/json" \
   -d '{
     "merchantId": 1,
     "serviceId": 1,
     "userId": "test-user-id",
     "datetime": "2025-01-20T10:00:00Z",
     "notes": "First time customer"
   }'
   ```

## 🎨 **UI/UX Features to Test**

### **🌙 Dark Mode**
- Toggle dark mode on provider page
- ✅ **Check:** All colors adapt properly
- ✅ **Check:** Cards and text remain readable

### **📱 Responsive Design**
- Test on mobile viewport
- ✅ **Check:** Sidebar collapses to hamburger menu
- ✅ **Check:** Service cards stack properly
- ✅ **Check:** Booking widget remains accessible

### **🎯 Trust Features**
- ✅ **Check:** Trust score prominently displayed
- ✅ **Check:** "Swee Protection" section shows
- ✅ **Check:** Anti-hard-selling messaging
- ✅ **Check:** Escrow payment protection mentioned

### **🏷️ Service Tags**
- ✅ **Check:** Tags display properly (e.g., "dry hair", "acne")
- ✅ **Check:** Categories show correctly (BEAUTY)
- ✅ **Check:** Price formatting consistent

## 🐛 **Known Issues & Fixes**

### **Fixed Issues:**
✅ Real data integration  
✅ API endpoints working  
✅ Service price formatting  
✅ Review date formatting  
✅ Booking flow navigation  

### **Potential Edge Cases:**
- Empty search results
- Invalid merchant IDs
- Network timeouts
- Date selection validation

## 🎉 **Success Criteria**

### **✅ Core Functionality**
- [ ] Landing page loads Bella Beauty Studio
- [ ] Provider detail page shows real data
- [ ] Service selection works
- [ ] Booking flow completes
- [ ] APIs return correct data

### **✅ Data Accuracy**
- [ ] All 8 services display
- [ ] Prices match database ($65-$180 range)
- [ ] Reviews show real customer feedback
- [ ] Contact information accurate

### **✅ User Experience**
- [ ] Navigation smooth and intuitive
- [ ] Loading states appear
- [ ] Error handling graceful
- [ ] Mobile experience optimal

## 🚀 **Next Steps**

1. **Complete Booking Flow** - Implement payment processing
2. **Review System** - Allow customers to leave new reviews
3. **Calendar Integration** - Real availability checking
4. **Notification System** - Booking confirmations
5. **Search Enhancement** - Filter by price, rating, distance

---

## 💡 **Pro Tips**

- **Use realistic test data** when booking (future dates only)
- **Test in both light and dark modes** for full coverage
- **Try different screen sizes** to verify responsiveness
- **Check browser console** for any JavaScript errors
- **Test with slow network** to verify loading states

Happy testing! 🧪✨
