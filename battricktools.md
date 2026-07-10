Here is your operational cheat sheet prompt designed to be copied and pasted into your team notes or reused to evaluate any current or future player's training viability.

# **Battrick Training Optimization Blueprint**

## **1\. Core Mathematical Foundations**

### **Formula A: Skill Level Threshold Expansion (Target Curve)**

The baseline points required to trigger a skill "pop" increase exponentially as a player reaches higher tiers.

$$T(L) \= a \\cdot b^L$$

* **$T(L)$**: Target training points required to cross into skill level $L$.  
* **$b$**: The scaling threshold multiplier (modeled by the community between $1.08 \\text{ to } 1.12$).  
* **The Impact**: Moving up high-tier levels requires vastly more input points than low-tier levels, independent of age.

### **Formula B: Age Degradation Factor (Absorption Multiplier)**

A player's age behaves like an algorithmic funnel coefficient ($\\alpha$) that slashes the percentage of training a player's profile can absorb per session.

$$\\alpha(A) \= \\frac{1}{1 \+ e^{k(A \- A\_{cliff})}}$$

* **Ages 17–19**: $\\alpha \\approx 1.0$ (100% training baseline efficiency).  
* **Ages 20–21**: Inflection/slowdown zone where efficiency drops.  
* **Ages 22+**: Hits the $A\_{cliff}$ penalty. Absorption levels drop into heavy diminishing returns.

### **Formula C: Net Stacking Decay (Logarithmic Diminishing Returns)**

When multiple nets of the exact same discipline are allocated to a single player to bypass the age cliff, a logarithmic decay multiplier ($M$) limits absolute progression:

$$M(N) \= 1 \+ \\ln(N) \\cdot c$$

* **1 Net**: 1.0 Net Power (100% efficiency per net)  
* **2 Nets**: \~1.6 Net Power (80% efficiency per net)  
* **3 Nets**: \~2.1 Net Power (**70% efficiency** — *The Optimal Stacking Sweet Spot*)  
* **4 Nets**: \~2.5 Net Power (62% efficiency — *Inefficient Over-stacking*)

## **2\. Definitive Single-Net Pop Timings (Mean Weeks)**

Crowdsourced management data tracks how many real-world weeks a player must sit on a **single primary net** to trigger a skill pop based on the intersecting curves of Age vs. Target Level:

| Age | Low Skill (Level 7\) | Mid Skill (Level 12\) | High Skill (Level 19\) | Max Skill (Level 20\) |
| :---- | :---- | :---- | :---- | :---- |
| **17** | 9.8 weeks | — | — | — |
| **18** | 10.5 weeks | 10.88 weeks | — | — |
| **19** | — | 11.6 weeks | — | — |
| **20** | 11.0 weeks | 11.4 weeks | — | — |
| **21** | — | 12.33 weeks | — | — |
| **22** | 12.5 weeks | — | 21.0 weeks | — |
| **23** | 15.0 weeks | — | 21.75 weeks | 27.0 weeks |
| **24** | — | — | 26.75 weeks | 35.5 weeks |
| **26** | — | — | — | 40.5 weeks |
| **27** | — | — | — | 46.5 weeks |

## **3\. The 3-Rule Strategic Checklist**

1. **The Age 21 Freezecap**: Instantly cut all primary nets (Batting/Bowling) on any player hitting age 21 or older unless they are a generational player finishing an elite milestone pop.  
2. **The "Mono-Training" Cap**: Maintain an absolute maximum of **2 to 3 youth trainees** simultaneously per season. Attempting to train 4 or more players ruins your club's efficiency by spreading nets too thin.  
3. **The Target Pipeline**: Structure your primary targets on exactly **3 Primary Nets \+ 1 Secondary Net (Fielding/Keeping)** alongside keeping a backroom staff of 10 Coaches and 3–5 Sports Psychologists to maximize sub-skill generation (Concentration and Consistency).

## **4\. Crucial Tooling & Analytics Links**

* **Live Strategy Tool**: [Battrick Training & Wage Calculator (Vercel)](https://training-calc.vercel.app/) — Essential for reverse-engineering modern wage scaling, forecasting upcoming player updates, and auditing current weekly nets.  
* **Crowdsourced Baseline Tables**: [Battrick Training Times Analysis (RPubs)](https://rpubs.com/Nyd_Designs/1277246) — The comprehensive source for community-tracked scatter graphs mapping historical weeks-per-pop matrices across primary, secondary, keeping, and fielding benchmarks.