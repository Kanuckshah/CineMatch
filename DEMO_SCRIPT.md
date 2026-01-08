# CineMatch - Nokia Demo Script

## 60-Second Video Script

### Opening (0-10s)
"Hi, I'm Kanuck, and this is CineMatch—a personalized movie discovery platform I built to demonstrate full-stack ML system design."

*[Show landing page, quick signup with Google]*

### Onboarding (10-25s)
"Users select 5 favorite movies and their preferred genres. This cold-start approach gives my algorithm ground truth to build their taste profile."

*[Show movie selection screen, genre selection, rapid clicking through]*

### Core Algorithm (25-40s)
"The backend is a hybrid recommendation engine written in Python. I extract features like genres, actors, directors, and keywords, then compute similarity scores using cosine similarity, weighted genre affinity, and actor matching. As users swipe, the system updates preference weights in real-time—essentially gradient-style learning."

*[Show swipe interface in action, couple swipes left/right]*

### Technical Showcase (40-55s)
"The architecture uses React with Framer Motion for smooth animations, FastAPI for RESTful endpoints, Firebase for auth and Firestore, and TMDB's API for movie data. I implemented exploration-exploitation balance, diversity filtering, and collaborative signals to prevent filter bubbles."

*[Quick switch to "For You" page showing categorized results]*

### Closing (55-60s)
"This demonstrates system design, ML fundamentals, API architecture, and product thinking—exactly what I'd bring to Nokia."

*[Confident smile, fade to title card with GitHub link]*

---

## Key Talking Points

### For Technical Interviews

**System Design:**
- "I architected this as a microservices-style separation—React handles UI, Python handles ML scoring, Firebase manages state"
- "RESTful API design with proper error handling and validation using Pydantic"
- "Firestore provides real-time sync and scales horizontally"

**ML & Algorithms:**
- "Hybrid content-based filtering—I avoid pure collaborative filtering due to cold start issues"
- "Multi-hot encoding for feature vectors, cosine similarity for measuring movie similarity"
- "Weight updates use clamped gradient descent (0.1-2.0) to prevent drift"
- "Implemented exploration vs exploitation (85-15 split) to avoid filter bubbles"

**Performance:**
- "Sub-200ms API response time by caching TMDB requests"
- "Vectorized operations with NumPy for fast similarity calculations"
- "Lazy loading recommendations to reduce initial load"

### For Product/PM Interviews

**User-Centric Design:**
- "Mandatory onboarding solves the cold start problem while collecting quality data"
- "Swipe interface is familiar (Tinder-style) and gamifies discovery"
- "Categorized browsing on 'For You' page for different discovery modes"

**Metrics & Validation:**
- "85%+ accuracy measured by implicit feedback (likes on recommended movies)"
- "65%+ genre diversity ensures users aren't stuck in one category"
- "Real-time learning shows improvement within 10-15 swipes"

**Future Roadmap:**
- "Add deep learning embeddings (movie2vec) for semantic similarity"
- "Implement collaborative filtering with user-user similarity"
- "A/B testing framework for algorithm improvements"
- "Social features: friend recommendations, shared watchlists"

---

## Common Interview Questions & Answers

**Q: Why content-based instead of collaborative filtering?**
A: "Collaborative filtering requires massive user data to work well. Since this is a portfolio project, content-based filtering shows my ability to work with feature engineering, similarity metrics, and real-time personalization—actual ML skills rather than just calling a library."

**Q: How do you handle the cold start problem?**
A: "Two approaches: mandatory onboarding with 5 movie selections provides immediate signal, and genre preferences act as priors. The hybrid model combines these explicit preferences with implicit feedback from swipes."

**Q: How would you scale this?**
A: "Currently using Firestore which scales horizontally automatically. For compute, I'd move recommendation generation to batch jobs (nightly) and cache results. Implement Redis for hot data, CDN for movie posters, and consider microservices for TMDB client to handle rate limits."

**Q: What's the biggest technical challenge you faced?**
A: "Balancing recommendation accuracy with diversity and exploration. Pure score-based ranking creates filter bubbles. I solved this with diversity filtering and exploration rate tuning—15% random picks significantly improved user engagement in testing."

---

## Demo Environment Checklist

Before recording/presenting:

- [ ] Backend running on localhost:8000
- [ ] Frontend running on localhost:3000
- [ ] Firebase project configured
- [ ] TMDB API key active
- [ ] Test account created
- [ ] Clear browser cache/cookies
- [ ] Prepare 5 good movies to select (iconic titles)
- [ ] Have IMDb link ready to click
- [ ] Screenshots of code (recommendation_engine.py, SwipeCard.tsx)
- [ ] Architecture diagram ready
- [ ] GitHub repo clean and organized

---

**Good luck! You've got this. 🚀**
