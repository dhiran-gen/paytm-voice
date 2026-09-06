// Authentic Preloaded International Student Applications & Initial Intelligence State

import { buildApplicantKnowledgeGraph } from '../services/agents/knowledgeGraphBuilder';
import { chunkDocumentText } from '../services/documentParser';
import { Applicant } from '../types';

export const INITIAL_APPLICANTS: Applicant[] = [
  // ----------------------------------------------------
  // 1. ANANYA SHARMA (India -> MS in Computer Science, AI Track)
  // ----------------------------------------------------
  {
    id: 'app_ananya_sharma',
    applicationNumber: 'ADM-2026-8819',
    firstName: 'Ananya',
    lastName: 'Sharma',
    email: 'ananya.sharma@alumni.iitb.ac.in',
    countryOfOrigin: 'India',
    nationality: 'Indian',
    passportNumber: 'Z8942104',
    targetProgram: 'MS in Computer Science',
    targetSpecialization: 'Artificial Intelligence & Machine Learning',
    targetTerm: 'Fall 2026',
    targetDegreeLevel: 'MASTER',
    appliedDate: '2026-01-14',
    status: 'REVIEW_COMPLETED',
    undergraduateInstitution: 'Indian Institute of Technology Bombay (IIT Bombay)',
    undergraduateMajor: 'Computer Science and Engineering',
    rawGPA: '9.32 / 10.0 CGPA',
    normalizedGPA: 3.88,
    englishProficiencyType: 'IELTS',
    englishOverallScore: 8.5,
    englishSubScores: {
      reading: 9.0,
      listening: 8.5,
      speaking: 8.0,
      writing: 8.0,
    },
    greScore: {
      quant: 169,
      verbal: 162,
      awa: 4.5,
    },
    tags: ['Top Tier', 'IEEE Publication', 'IIT Alumni', 'High Funding'],
    isFavorite: true,
    lastAnalyzedAt: '2026-02-18T10:15:00Z',
    humanDecision: {
      decision: 'ADMIT',
      officerName: 'Dr. Evelyn Reed',
      officerRole: 'Senior International Admissions Dean',
      timestamp: '2026-02-20T14:30:00Z',
      notes: 'Exceptional academic pedigree, top 1% faculty recommendation, and published research in multi-agent RL. Verified $68,000 USD liquid assets. Approved for Dean’s Merit Fellowship nomination ($10,000).',
      scholarshipRecommendedUSD: 10000,
    },
    documents: [
      {
        id: 'doc_ananya_transcript',
        applicantId: 'app_ananya_sharma',
        name: 'Official_Academic_Transcript_IIT_Bombay.pdf',
        type: 'TRANSCRIPT',
        fileSize: 1420000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-01-14T08:30:00Z',
        ocrApplied: false,
        pageCount: 3,
        status: 'COMPLETED',
        extractedText: `INDIAN INSTITUTE OF TECHNOLOGY BOMBAY
OFFICIAL TRANSCRIPT OF ACADEMIC RECORD
Student Name: Ananya Sharma | Roll Number: 210050042
Degree Conferred: Bachelor of Technology in Computer Science and Engineering
Cumulative Grade Point Average (CGPA): 9.32 / 10.00
Grading Scale: 10-Point Letter Grade System (10=AA/Outstanding, 9=AB/Excellent, 8=BB/Very Good)
Class Rank: 4 of 148 students (Top 3%)

KEY COURSEWORK & GRADES:
- CS 213 Data Structures and Algorithms: Grade 10/10 (AA)
- CS 218 Design and Analysis of Algorithms: Grade 10/10 (AA)
- CS 337 Artificial Intelligence: Grade 10/10 (AA)
- CS 344 Machine Learning Systems: Grade 9/10 (AB)
- CS 419 Deep Reinforcement Learning: Grade 10/10 (AA)
- MA 106 Linear Algebra: Grade 10/10 (AA)
- MA 108 Differential Equations: Grade 10/10 (AA)
- CS 347 Operating Systems & Virtualization: Grade 9/10 (AB)
- CS 405 Distributed Systems Architecture: Grade 9/10 (AB)

Backlogs / Failures: Nil.
Institutional Remarks: Degree awarded with Institute Honors and Distinction.`,
        chunks: [],
      },
      {
        id: 'doc_ananya_sop',
        applicantId: 'app_ananya_sharma',
        name: 'Statement_of_Purpose_Ananya_Sharma.pdf',
        type: 'SOP',
        fileSize: 850000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-01-14T08:35:00Z',
        ocrApplied: false,
        pageCount: 2,
        status: 'COMPLETED',
        extractedText: `STATEMENT OF PURPOSE: MS IN COMPUTER SCIENCE (ARTIFICIAL INTELLIGENCE)
Applicant: Ananya Sharma

My fascination with artificial intelligence stems from a core intellectual paradox: while single-agent reinforcement learning models exhibit superhuman performance in structured games, decentralized multi-agent systems often destabilize when deployed in dynamic, asynchronous real-world swarms. During my undergraduate thesis at IIT Bombay under Prof. Ramesh Krishnamurthy, I formulated decentralized policy optimization architectures to address reward variance in multi-UAV obstacle avoidance. This work culminated in our accepted workshop paper at IEEE ICRA 2025.

During my four-month research engineering internship at HyperScale AI Labs, I transitioned from theoretical proofs to scalable hardware kernels. Collaborating with senior research scientists, I implemented custom GPU attention shaders that accelerated transformer inference by 3.2x on resource-constrained robotics hardware.

I aspire to pursue my Master of Science in Computer Science at your esteemed institution because of your cutting-edge Autonomous Robotics and Multi-Agent Systems Laboratory. In particular, Professor Sarah Vance’s recent work on provably robust cooperative policies directly aligns with my thesis goals. I look forward to contributing actively to your faculty's NSF-funded autonomous swarms initiative and mentoring undergraduate researchers.`,
        chunks: [],
      },
      {
        id: 'doc_ananya_resume',
        applicantId: 'app_ananya_sharma',
        name: 'Resume_Curriculum_Vitae_Ananya_Sharma.pdf',
        type: 'RESUME',
        fileSize: 520000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-01-14T08:40:00Z',
        ocrApplied: false,
        pageCount: 2,
        status: 'COMPLETED',
        extractedText: `ANANYA SHARMA | ananya.sharma@alumni.iitb.ac.in | Mumbai, India

EDUCATION
- Bachelor of Technology in Computer Science & Engineering | IIT Bombay | CGPA: 9.32/10 (2021 - 2025)

RESEARCH PUBLICATIONS
- A. Sharma, R. Krishnamurthy. "Decentralized Policy Optimization for Multi-Agent Navigation in Dynamic Clutter." IEEE International Conference on Robotics and Automation (ICRA Workshop), 2025.

TECHNICAL SKILLS
- Programming: Python, C++, Java, CUDA, SQL, TypeScript
- Frameworks & Tools: PyTorch, JAX, ROS2, Triton GPU Compiler, Docker, Kubernetes, Git, Linux
- Specializations: Deep Reinforcement Learning, Robot Operating Systems, Distributed Inference

WORK EXPERIENCE
- Machine Learning Research Intern | HyperScale AI Research Labs (May 2025 – Aug 2025)
  * Optimized transformer attention kernels with Triton GPU shaders, achieving 3.2x latency reduction.
  * Benchmarked distributed multi-agent vision policies across cluster of 64 NVIDIA H100 GPUs.
- Software Engineering Intern | NexGen Cloud Systems (Jan 2025 – Apr 2025)
  * Constructed streaming telemetry ingestion pipeline processing 2M messages/sec with Apache Kafka and Go.

LEADERSHIP & SERVICE
- President, IIT Bombay AI & Robotics Society (managed 120+ active student developers, organized hackathons)
- Teaching Assistant, Data Structures & Algorithms (conducted weekly problem-solving tutorials for 90 freshmen)`,
        chunks: [],
      },
      {
        id: 'doc_ananya_lor_1',
        applicantId: 'app_ananya_sharma',
        name: 'Letter_of_Recommendation_Prof_Krishnamurthy.pdf',
        type: 'LOR',
        fileSize: 640000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-01-14T08:45:00Z',
        ocrApplied: false,
        pageCount: 1,
        status: 'COMPLETED',
        extractedText: `CONFIDENTIAL LETTER OF RECOMMENDATION
Re: Ananya Sharma for MS in Computer Science

I have served as Professor and Chair of the Computer Science Department at IIT Bombay for 15 years. It is an unreserved pleasure to recommend Ananya Sharma, who stands among the top 1% of the over 400 undergraduate researchers I have supervised throughout my academic career.

Ananya worked under my direct supervision for her senior undergraduate thesis on multi-agent reinforcement learning. What distinguishes Ananya is her mathematical self-sufficiency. When standard policy gradient baselines diverged due to non-stationary transition dynamics, she independently derived an analytical reward normalization technique that salvaged our experiments and produced our IEEE ICRA workshop publication.

Beyond research intellect, Ananya is a natural leader and mentor who served as President of our AI Society and guided junior students with exemplary patience. She has my highest possible recommendation for admission and research funding.`,
        chunks: [],
      },
      {
        id: 'doc_ananya_financial',
        applicantId: 'app_ananya_sharma',
        name: 'Bank_Solvency_&_Loan_Sanction_Certificate.pdf',
        type: 'FINANCIAL',
        fileSize: 980000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-01-14T08:50:00Z',
        ocrApplied: true,
        ocrConfidence: 96,
        pageCount: 2,
        status: 'COMPLETED',
        extractedText: `STATE BANK OF INDIA - OFFICIAL SOLVENCY CERTIFICATE
Branch: IIT Powai Branch, Mumbai | IFSC: SBIN0001109
Date: 08 January 2026

To: Graduate Admissions & International Student Services Office

This is to certify that Mr. Rajesh Sharma and Mrs. Sunita Sharma (Parents of Applicant Ananya Sharma) maintain unencumbered savings and fixed deposit accounts with our bank with an aggregate closing balance of INR 31,50,000 (Approx. $38,000 USD).

Furthermore, Applicant Ananya Sharma has been sanctioned a pre-approved National Education Overseas Scholar Loan (Ref: SBI/EDU/2026/7810) for the amount of INR 25,00,000 (Approx. $30,000 USD).

Total Verified Liquid & Loan Funds Available for Graduate Studies: INR 56,50,000 ($68,000 USD).
Account status: Verified Active, Liquid, and fully transferable abroad.`,
        chunks: [],
      },
      {
        id: 'doc_ananya_ielts',
        applicantId: 'app_ananya_sharma',
        name: 'IELTS_Official_Test_Report_Form.pdf',
        type: 'IELTS_TOEFL',
        fileSize: 450000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-01-14T08:55:00Z',
        ocrApplied: false,
        pageCount: 1,
        status: 'COMPLETED',
        extractedText: `INTERNATIONAL ENGLISH LANGUAGE TESTING SYSTEM (IELTS)
Test Report Form | Candidate Number: 014892
Candidate Name: SHARMA, Ananya
Test Date: 12 December 2025 | Overall Band Score: 8.5 (CEFR Level C2)
Listening: 8.5 | Reading: 9.0 | Writing: 8.0 | Speaking: 8.0
Test Center: British Council Mumbai | Verification Code: IELTS-TRF-25IN014892S`,
        chunks: [],
      }
    ],
    academicAnalysis: {
      score: 96,
      rawGPA: '9.32 / 10.0 CGPA',
      normalizedGPA: 3.88,
      gradingSystem: '10-Point CGPA Scale (IIT Bombay)',
      trend: 'CONSISTENTLY_HIGH',
      trendDescription: 'Demonstrates flawless academic mastery across all 8 semesters, consistently maintaining top-3% class standing.',
      backlogsOrRetakes: 0,
      researchCourseworkReadiness: 98,
      subjectBreakdown: [
        { subject: 'Data Structures & Algorithms', grade: '10/10 (AA)', normalizedScore: 100, category: 'CORE_CS', isStrength: true },
        { subject: 'Linear Algebra & Probability', grade: '10/10 (AA)', normalizedScore: 100, category: 'MATH', isStrength: true },
        { subject: 'Artificial Intelligence & Deep RL', grade: '10/10 (AA)', normalizedScore: 98, category: 'AI_ML', isStrength: true },
        { subject: 'Operating Systems Architecture', grade: '9/10 (AB)', normalizedScore: 90, category: 'CORE_CS', isStrength: true },
      ],
      academicConsistency: 'Exceptional consistency between undergraduate transcript, 169 GRE Quant, and advanced graduate preparation.',
      strengths: [
        'Top 3% class rank (4 of 148 students) at India\'s premier technical institution',
        'Perfect 10/10 grades in foundational algorithms, linear algebra, and reinforcement learning',
        'Strong quantitative GRE score of 169 (93rd percentile)'
      ],
      weaknesses: [],
      evidence: [
        {
          id: 'ev_acad_ananya',
          documentId: 'doc_ananya_transcript',
          documentName: 'Official_Academic_Transcript_IIT_Bombay.pdf',
          documentType: 'TRANSCRIPT',
          snippet: 'Cumulative Grade Point Average: 9.32 / 10.00. Degree awarded with Institute Honors and Distinction.',
          pageNumber: 1,
        }
      ]
    },
    sopAnalysis: {
      score: 95,
      motivationStrength: 96,
      writingQuality: 94,
      originalityScore: 95,
      clarityScore: 96,
      careerGoalClarity: 'Intends to research scalable decentralized multi-agent algorithms during graduate school, aiming for senior research scientist roles in autonomous systems.',
      universityFitAnalysis: 'Explicitly identifies Professor Sarah Vance\'s NSF-funded Autonomous Swarms Lab and matches department robotics computational facilities.',
      researchInterests: ['Multi-Agent Reinforcement Learning', 'Decentralized Swarm Robotics', 'GPU Kernel Acceleration'],
      crossValidationWithBackground: '100% corroborated: SOP claims of IEEE paper and GPU acceleration match resume and professor recommendation verbatim.',
      strengths: [
        'Compelling research narrative grounded in actual mathematical troubleshooting',
        'Explicit faculty alignment and deep familiarity with university ongoing research grants',
        'Flawless academic rhetoric without generic cliché phrasing'
      ],
      weaknesses: [],
      evidence: [
        {
          id: 'ev_sop_ananya',
          documentId: 'doc_ananya_sop',
          documentName: 'Statement_of_Purpose_Ananya_Sharma.pdf',
          documentType: 'SOP',
          snippet: 'During my undergraduate thesis at IIT Bombay, I formulated decentralized policy optimization architectures to address reward variance in multi-UAV obstacle avoidance.',
          pageNumber: 1,
        }
      ]
    },
    resumeAnalysis: {
      score: 94,
      technicalSkills: {
        programmingLanguages: ['Python', 'C++', 'Java', 'CUDA', 'TypeScript', 'SQL'],
        frameworksAndTools: ['PyTorch', 'JAX', 'ROS2', 'Triton', 'Docker', 'Kubernetes', 'Git'],
        specializations: ['Deep Reinforcement Learning', 'Autonomous Robotics', 'Distributed Systems']
      },
      softSkills: ['Research Mentorship', 'Technical Presentation', 'Open Source Collaboration'],
      projects: [
        {
          title: 'Decentralized Multi-Agent Navigation Framework',
          description: 'Designed decentralized RL policy gradient framework for multi-UAV swarms in ROS2/Gazebo.',
          technologies: ['Python', 'PyTorch', 'ROS2', 'C++'],
          impactOrOutcome: 'Published in IEEE ICRA Workshop 2025; 96% collision-free route completion.',
          verifiedInOtherDocs: true
        }
      ],
      internshipsAndWork: [
        {
          role: 'Machine Learning Research Intern',
          company: 'HyperScale AI Research Labs',
          duration: 'May 2025 - Aug 2025',
          responsibilities: ['Accelerated transformer inference by 3.2x using custom Triton GPU shaders.']
        }
      ],
      publications: [
        {
          title: 'Decentralized Policy Optimization for Multi-Agent Navigation in Dynamic Clutter',
          venueOrConference: 'IEEE ICRA Workshop',
          year: '2025',
          status: 'PUBLISHED'
        }
      ],
      leadershipRoles: ['President, IIT Bombay AI & Robotics Society (120+ members)'],
      strengths: [
        'First-author peer-reviewed publication at a leading IEEE robotics venue',
        'Proven high-performance GPU programming skills with Triton and CUDA',
        'Strong student leadership as AI Society President'
      ],
      weaknesses: [],
      evidence: [
        {
          id: 'ev_res_ananya',
          documentId: 'doc_ananya_resume',
          documentName: 'Resume_Curriculum_Vitae_Ananya_Sharma.pdf',
          documentType: 'RESUME',
          snippet: 'Optimized transformer attention kernels with Triton GPU shaders, achieving 3.2x latency reduction.',
          pageNumber: 1,
        }
      ]
    },
    recommendationAnalysis: {
      score: 98,
      leadershipRating: 94,
      teamworkRating: 95,
      communicationRating: 94,
      researchPotentialRating: 99,
      recommenders: [
        {
          name: 'Prof. Ramesh Krishnamurthy, Ph.D.',
          designation: 'Chair Professor of Computer Science',
          institution: 'IIT Bombay',
          relationship: 'Senior Thesis Advisor',
          durationKnown: '3 Years',
          sentiment: 'ENTHUSIASTIC',
          credibilityRating: 'VERY_HIGH',
          keyEndorsements: ['Top 1% of 400+ students in 15 years', 'Doctoral-level mathematical autonomy'],
          percentileClaim: 'Top 1% of 400+ students in 15-year career',
          anecdoteSummary: 'Independently derived reward variance normalization formula when baseline RL policies diverged.'
        }
      ],
      recommenderConsistency: 'Consistently describes applicant as an exceptionally gifted, mathematically rigorous researcher capable of doctoral-level independence.',
      strengths: [
        'Superlative percentile benchmark from department chair (top 1% in 15 years)',
        'Detailed anecdotal validation of analytical independence'
      ],
      weaknessesOrConcerns: [],
      evidence: [
        {
          id: 'ev_rec_ananya',
          documentId: 'doc_ananya_lor_1',
          documentName: 'Letter_of_Recommendation_Prof_Krishnamurthy.pdf',
          documentType: 'LOR',
          snippet: 'Stands among the top 1% of the over 400 undergraduate researchers I have supervised throughout my academic career.',
          pageNumber: 1,
        }
      ]
    },
    financialAnalysis: {
      score: 95,
      readinessStatus: 'FULLY_FUNDED',
      estimatedCostOfAttendance1Year: 58500,
      estimatedCostOfAttendance2Year: 117000,
      totalVerifiedLiquidFundsUSD: 68000,
      fundingGapUSD: 0,
      sourcesOfFunding: [
        {
          sourceType: 'BANK_DEPOSIT',
          amountUSD: 38000,
          sponsorRelationship: 'Parents (Savings & Fixed Deposits at SBI)',
          verificationStatus: 'VERIFIED',
          documentName: 'Bank_Solvency_&_Loan_Sanction_Certificate.pdf'
        },
        {
          sourceType: 'EDUCATION_LOAN',
          amountUSD: 30000,
          sponsorRelationship: 'State Bank of India Pre-Approved Overseas Loan',
          verificationStatus: 'VERIFIED',
          documentName: 'Bank_Solvency_&_Loan_Sanction_Certificate.pdf'
        }
      ],
      missingFinancialDocuments: [],
      financialReviewRequired: false,
      recommendations: [
        'Verified liquid funds ($68,000 USD) exceed Year-1 I-20 COA requirement ($58,500 USD) with $9,500 cushion.',
        'All bank certificates carry official bank seals and manager endorsements.'
      ],
      evidence: [
        {
          id: 'ev_fin_ananya',
          documentId: 'doc_ananya_financial',
          documentName: 'Bank_Solvency_&_Loan_Sanction_Certificate.pdf',
          documentType: 'FINANCIAL',
          snippet: 'Total Verified Liquid & Loan Funds Available for Graduate Studies: INR 56,50,000 ($68,000 USD).',
          pageNumber: 1,
        }
      ]
    },
    riskAnalysis: {
      overallRiskLevel: 'LOW',
      riskScore: 98,
      flaggedRisks: [],
      missingMandatoryDocuments: [],
      inconsistencyAudit: 'Flawless cross-document integrity. All claims across Transcript, Resume, SOP, and LOR are completely corroborated with zero timeline gaps or unverified assertions.',
      evidence: [
        {
          id: 'ev_risk_ananya',
          documentId: 'doc_ananya_transcript',
          documentName: 'Official_Academic_Transcript_IIT_Bombay.pdf',
          documentType: 'TRANSCRIPT',
          snippet: 'Continuous 4-year enrollment record verified with official seal.',
          pageNumber: 1,
        }
      ]
    },
    reasoningResult: {
      overallRecommendation: 'STRONGLY_RECOMMEND_ADMIT',
      confidenceScore: 96,
      executiveSummary: 'Ananya Sharma represents the highest tier of international applicants for the MS in Computer Science (AI Track). Boasts top-3% class rank at IIT Bombay, published IEEE research, top 1% faculty endorsements, and $68,000 USD in verified liquid funding.',
      comprehensiveProfileSummary: 'The applicant possesses a rare combination of pure mathematical rigor and advanced systems engineering. Her undergraduate coursework reflects straight A grades in foundational CS and math. Her published research in multi-agent RL demonstrates immediate capability to contribute to ongoing funded lab projects. Recommend immediate admission with merit scholarship nomination.',
      crossDocumentSynergyAnalysis: 'Exceptional coherence: SOP research goals on decentralized RL swarms are directly demonstrated in her IEEE ICRA publication and verified by her department chair’s recommendation.',
      coreStrengths: [
        {
          title: 'Stellar Academic Standing from Top-Ranked Institution',
          description: '9.32/10 CGPA (3.88/4.0 normalized), 4th rank in class of 148 at IIT Bombay with perfect scores in algorithms and linear algebra.',
          supportingAgents: ['Academic Intelligence'],
          evidence: {
            id: 'ev_str_ananya_1',
            documentId: 'doc_ananya_transcript',
            documentName: 'Official_Academic_Transcript_IIT_Bombay.pdf',
            documentType: 'TRANSCRIPT',
            snippet: 'Cumulative Grade Point Average: 9.32 / 10.00. Class Rank: 4 of 148 students.',
            pageNumber: 1,
          }
        },
        {
          title: 'First-Author Peer-Reviewed Research Publication',
          description: 'Published in IEEE ICRA Workshop 2025 on multi-agent decentralized policy optimization.',
          supportingAgents: ['Resume Intelligence', 'SOP Intelligence'],
          evidence: {
            id: 'ev_str_ananya_2',
            documentId: 'doc_ananya_resume',
            documentName: 'Resume_Curriculum_Vitae_Ananya_Sharma.pdf',
            documentType: 'RESUME',
            snippet: 'Published: "Decentralized Policy Optimization for Multi-Agent Navigation in Dynamic Clutter" (IEEE ICRA 2025).',
            pageNumber: 1,
          }
        },
        {
          title: 'Top 1% Faculty Benchmark & Verified Liquid Funding',
          description: 'Endorsed in the top 1% of 400+ students by department chair; $68,000 USD verified liquid funding.',
          supportingAgents: ['Recommendation Intelligence', 'Financial Intelligence'],
          evidence: {
            id: 'ev_str_ananya_3',
            documentId: 'doc_ananya_lor_1',
            documentName: 'Letter_of_Recommendation_Prof_Krishnamurthy.pdf',
            documentType: 'LOR',
            snippet: 'Ranks among the top 1% of over 400 undergraduate researchers I have supervised throughout my academic career.',
            pageNumber: 1,
          }
        }
      ],
      coreWeaknesses: [],
      tailoredInterviewQuestions: [
        {
          category: 'TECHNICAL',
          question: 'Can you walk us through the mathematical derivation you used to normalize reward variance in decentralized policy gradients?',
          rationale: 'Validates independent mathematical contribution on the IEEE ICRA workshop publication.',
          targetToProbe: 'Verify independent proof formulation.'
        },
        {
          category: 'SOP_ALIGNMENT',
          question: 'How do you plan to leverage our NSF-funded autonomous robotics testbed in your prospective master\'s thesis?',
          rationale: 'Evaluates department research alignment.',
          targetToProbe: 'Knowledge of current lab instrumentation.'
        }
      ],
      admissionCommitteeTalkingPoints: [
        'Unanimous admit recommendation across all 6 AI agents.',
        'Nominate for Dean\'s Graduate Merit Fellowship ($10,000).',
        'Direct referral to Professor Sarah Vance for Research Assistantship (RA).'
      ]
    }
  },

  // ----------------------------------------------------
  // 2. CHEN WEI (China -> MS in Robotics & Autonomous Systems)
  // ----------------------------------------------------
  {
    id: 'app_chen_wei',
    applicationNumber: 'ADM-2026-7432',
    firstName: 'Chen',
    lastName: 'Wei',
    email: 'chen.wei@mails.tsinghua.edu.cn',
    countryOfOrigin: 'China',
    nationality: 'Chinese',
    passportNumber: 'E78491023',
    targetProgram: 'MS in Robotics & Autonomous Systems',
    targetSpecialization: 'Computer Vision & Robot Perception',
    targetTerm: 'Fall 2026',
    targetDegreeLevel: 'MASTER',
    appliedDate: '2026-01-20',
    status: 'REVIEW_COMPLETED',
    undergraduateInstitution: 'Tsinghua University',
    undergraduateMajor: 'Automation and Control Engineering',
    rawGPA: '3.86 / 4.00 (89.4%)',
    normalizedGPA: 3.86,
    englishProficiencyType: 'TOEFL',
    englishOverallScore: 108,
    englishSubScores: {
      reading: 29,
      listening: 28,
      speaking: 25,
      writing: 26,
    },
    greScore: {
      quant: 170,
      verbal: 158,
      awa: 4.0,
    },
    tags: ['Tsinghua', 'Robotics', 'DJI Intern', 'Self-Funded'],
    isFavorite: false,
    lastAnalyzedAt: '2026-02-19T11:20:00Z',
    documents: [
      {
        id: 'doc_chen_transcript',
        applicantId: 'app_chen_wei',
        name: 'Tsinghua_University_Official_Transcript.pdf',
        type: 'TRANSCRIPT',
        fileSize: 1200000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-01-20T09:10:00Z',
        ocrApplied: false,
        pageCount: 2,
        status: 'COMPLETED',
        extractedText: `TSINGHUA UNIVERSITY - OFFICIAL ACADEMIC TRANSCRIPT
Name: Chen Wei | Department: Automation | Degree: Bachelor of Engineering
Overall GPA: 3.86 / 4.00 (Weighted Average: 89.4%)

CORE COURSES:
- Automatic Control Principles: 94% (A)
- Robotics Kinematics and Dynamics: 96% (A+)
- Computer Vision for Mobile Robots: 92% (A)
- Digital Signal Processing: 88% (A-)
- Advanced C++ and ROS Programming: 95% (A)
- Probability and Stochastic Processes: 90% (A)`,
        chunks: [],
      },
      {
        id: 'doc_chen_sop',
        applicantId: 'app_chen_wei',
        name: 'Statement_of_Purpose_Chen_Wei.pdf',
        type: 'SOP',
        fileSize: 760000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-01-20T09:15:00Z',
        ocrApplied: false,
        pageCount: 2,
        status: 'COMPLETED',
        extractedText: `STATEMENT OF PURPOSE - CHEN WEI
MS IN ROBOTICS & AUTONOMOUS SYSTEMS

During my undergraduate studies in Automation at Tsinghua University, I dedicated myself to real-time robot perception. During my 6-month internship at DJI Robotics Perception Lab, I developed visual SLAM pipelines for aerial drones navigating feature-scarce tunnels.

I seek to join your MS in Robotics program to focus on multimodal sensor fusion combining LiDAR, event-based cameras, and IMU under extreme lighting variations. Your Robotics Perception and Navigation Group (RPNG) is world-renowned for robust visual-inertial odometry.`,
        chunks: [],
      },
      {
        id: 'doc_chen_resume',
        applicantId: 'app_chen_wei',
        name: 'Resume_Chen_Wei.pdf',
        type: 'RESUME',
        fileSize: 490000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-01-20T09:20:00Z',
        ocrApplied: false,
        pageCount: 2,
        status: 'COMPLETED',
        extractedText: `CHEN WEI | Beijing, China
EDUCATION: B.Eng. in Automation, Tsinghua University (GPA 3.86/4.00)
SKILLS: C++, Python, ROS/ROS2, OpenCV, Ceres Solver, Eigen, Point Cloud Library (PCL), Gazebo, Linux
WORK EXPERIENCE:
- Robotics Perception Intern, DJI Technology Co., Ltd. (Mar 2025 – Sep 2025)
  * Implemented real-time stereo visual-inertial SLAM on embedded Jetson AGX Orin.
PROJECTS:
- Autonomous Quadrotor LiDAR-Visual Mapping System (Tsinghua RoboMaster Team)`,
        chunks: [],
      },
      {
        id: 'doc_chen_financial',
        applicantId: 'app_chen_wei',
        name: 'Bank_Solvency_Certificate_Bank_of_China.pdf',
        type: 'FINANCIAL',
        fileSize: 890000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-01-20T09:25:00Z',
        ocrApplied: true,
        ocrConfidence: 98,
        pageCount: 1,
        status: 'COMPLETED',
        extractedText: `BANK OF CHINA - CERTIFICATE OF DEPOSIT
Account Holder: Wei Chen / Wei Zhang (Father)
Closing Liquid Balance: RMB 600,000 (Approx. $82,500 USD).
Funds are fully liquid and verified for educational expenditures abroad.`,
        chunks: [],
      }
    ],
    academicAnalysis: {
      score: 94,
      rawGPA: '3.86 / 4.00 (89.4%)',
      normalizedGPA: 3.86,
      gradingSystem: '4.00 Scale (Tsinghua University)',
      trend: 'CONSISTENTLY_HIGH',
      trendDescription: 'Consistent top-tier grades in robotics, control theory, and high-performance C++.',
      backlogsOrRetakes: 0,
      researchCourseworkReadiness: 94,
      subjectBreakdown: [
        { subject: 'Robotics Kinematics & Dynamics', grade: '96% (A+)', normalizedScore: 96, category: 'CORE_CS', isStrength: true },
        { subject: 'Automatic Control Principles', grade: '94% (A)', normalizedScore: 94, category: 'CORE_CS', isStrength: true },
        { subject: 'Computer Vision for Mobile Robots', grade: '92% (A)', normalizedScore: 92, category: 'AI_ML', isStrength: true },
      ],
      academicConsistency: 'High consistency between Tsinghua GPA and 170 GRE Quant.',
      strengths: ['Tsinghua University pedigree', 'Perfect 170 GRE Quantitative', 'Extensive C++ and ROS coursework'],
      weaknesses: [],
      evidence: []
    },
    sopAnalysis: {
      score: 92,
      motivationStrength: 91,
      writingQuality: 92,
      originalityScore: 92,
      clarityScore: 93,
      careerGoalClarity: 'Desires to lead visual-inertial SLAM sensor fusion research in autonomous robotics.',
      universityFitAnalysis: 'Strong alignment with university Robotics Perception and Navigation Group (RPNG).',
      researchInterests: ['Visual-Inertial SLAM', 'Multimodal Sensor Fusion', 'Event-Based Vision'],
      crossValidationWithBackground: 'High consistency with DJI robotics internship and RoboMaster project.',
      strengths: ['Detailed technical familiarity with visual SLAM pipelines'],
      weaknesses: [],
      evidence: []
    },
    resumeAnalysis: {
      score: 93,
      technicalSkills: {
        programmingLanguages: ['C++', 'Python', 'C', 'MATLAB'],
        frameworksAndTools: ['ROS', 'ROS2', 'OpenCV', 'Ceres Solver', 'PCL', 'Gazebo', 'Jetson AGX Orin'],
        specializations: ['Visual SLAM', 'Perception', 'State Estimation']
      },
      softSkills: ['Team Competition Collaboration', 'Field Testing'],
      projects: [{ title: 'Autonomous Quadrotor LiDAR-Visual Mapping System', description: 'Real-time mapping on Jetson Orin', technologies: ['C++', 'ROS2', 'Ceres'], impactOrOutcome: 'Sub-centimeter mapping accuracy', verifiedInOtherDocs: true }],
      internshipsAndWork: [{ role: 'Robotics Perception Intern', company: 'DJI Technology', duration: '6 Months', responsibilities: ['Stereo VIO pipeline optimization'] }],
      publications: [],
      leadershipRoles: ['Tsinghua RoboMaster Perception Lead'],
      strengths: ['Extensive hands-on systems experience at DJI', 'Mastery of C++ and Ceres optimization'],
      weaknesses: ['No peer-reviewed publications yet'],
      evidence: []
    },
    recommendationAnalysis: {
      score: 90,
      leadershipRating: 88,
      teamworkRating: 92,
      communicationRating: 86,
      researchPotentialRating: 91,
      recommenders: [{ name: 'Prof. Li Bo', designation: 'Professor of Automation', institution: 'Tsinghua University', relationship: 'RoboMaster Faculty Advisor', durationKnown: '2 Years', sentiment: 'ENTHUSIASTIC', credibilityRating: 'VERY_HIGH', keyEndorsements: ['Top 3% robotics student'], anecdoteSummary: 'Led vision pipeline for autonomous competition robot.' }],
      recommenderConsistency: 'High praise for programming rigor and work ethic.',
      strengths: ['Strong faculty support from Tsinghua'],
      weaknessesOrConcerns: [],
      evidence: []
    },
    financialAnalysis: {
      score: 98,
      readinessStatus: 'FULLY_FUNDED',
      estimatedCostOfAttendance1Year: 58500,
      estimatedCostOfAttendance2Year: 117000,
      totalVerifiedLiquidFundsUSD: 82500,
      fundingGapUSD: 0,
      sourcesOfFunding: [{ sourceType: 'BANK_DEPOSIT', amountUSD: 82500, sponsorRelationship: 'Family Savings (Bank of China)', verificationStatus: 'VERIFIED', documentName: 'Bank_Solvency_Certificate_Bank_of_China.pdf' }],
      missingFinancialDocuments: [],
      financialReviewRequired: false,
      recommendations: ['Verified liquid funds ($82,500 USD) significantly exceed 1-year requirement ($58,500 USD).'],
      evidence: []
    },
    riskAnalysis: {
      overallRiskLevel: 'LOW',
      riskScore: 96,
      flaggedRisks: [],
      missingMandatoryDocuments: [],
      inconsistencyAudit: 'Clean profile, all claims verified.',
      evidence: []
    },
    reasoningResult: {
      overallRecommendation: 'STRONGLY_RECOMMEND_ADMIT',
      confidenceScore: 94,
      executiveSummary: 'Chen Wei is a premier candidate from Tsinghua University with a 3.86 GPA, perfect 170 GRE Quant, substantive 6-month perception engineering experience at DJI, and $82,500 USD liquid funding.',
      comprehensiveProfileSummary: 'Chen exhibits exceptional hands-on C++ and ROS2 robotics systems engineering capability. His background aligns seamlessly with the Robotics & Autonomous Systems master curriculum.',
      crossDocumentSynergyAnalysis: 'High alignment between Tsinghua coursework, DJI internship, and SOP research trajectory.',
      coreStrengths: [
        { title: 'Tsinghua Academic Distinction', description: '3.86 GPA with 170 GRE Quantitative.', supportingAgents: ['Academic Intelligence'], evidence: { id: 'ev_chen_1', documentId: 'doc_chen_transcript', documentName: 'Tsinghua_University_Official_Transcript.pdf', documentType: 'TRANSCRIPT', snippet: 'Overall GPA: 3.86 / 4.00 (Weighted Average: 89.4%).' } },
        { title: 'Substantive Industry Perception Experience at DJI', description: 'Built stereo visual SLAM pipelines on Jetson Orin.', supportingAgents: ['Resume Intelligence'], evidence: { id: 'ev_chen_2', documentId: 'doc_chen_resume', documentName: 'Resume_Chen_Wei.pdf', documentType: 'RESUME', snippet: 'Implemented real-time stereo visual-inertial SLAM on embedded Jetson AGX Orin.' } }
      ],
      coreWeaknesses: [],
      tailoredInterviewQuestions: [
        { category: 'TECHNICAL', question: 'How did you handle visual scale drift when inertial excitation was low in your DJI SLAM setup?', rationale: 'Probes state estimation depth.', targetToProbe: 'Nonlinear optimization intuition.' }
      ],
      admissionCommitteeTalkingPoints: ['Highly recommended for direct admission into the Robotics MS.']
    }
  },

  // ----------------------------------------------------
  // 3. LUCAS SILVA (Brazil -> MS in Software Engineering)
  // ----------------------------------------------------
  {
    id: 'app_lucas_silva',
    applicationNumber: 'ADM-2026-6190',
    firstName: 'Lucas',
    lastName: 'Silva',
    email: 'lucas.silva@techalumni.usp.br',
    countryOfOrigin: 'Brazil',
    nationality: 'Brazilian',
    passportNumber: 'FB990142',
    targetProgram: 'MS in Software Engineering',
    targetSpecialization: 'Distributed Cloud Systems & Microservices',
    targetTerm: 'Fall 2026',
    targetDegreeLevel: 'MASTER',
    appliedDate: '2026-01-25',
    status: 'FINANCIAL_REVIEW_REQUIRED',
    undergraduateInstitution: 'University of São Paulo (USP)',
    undergraduateMajor: 'Information Systems',
    rawGPA: '7.6 / 10.0 (Normalized: 3.25/4.0)',
    normalizedGPA: 3.25,
    englishProficiencyType: 'TOEFL',
    englishOverallScore: 102,
    englishSubScores: {
      reading: 27,
      listening: 26,
      speaking: 24,
      writing: 25,
    },
    tags: ['5 Yrs Industry Exp', 'Nubank Senior Dev', 'Upward GPA Trend', 'Financial Gap'],
    isFavorite: false,
    lastAnalyzedAt: '2026-02-18T16:45:00Z',
    documents: [
      {
        id: 'doc_lucas_transcript',
        applicantId: 'app_lucas_silva',
        name: 'University_of_Sao_Paulo_Transcript.pdf',
        type: 'TRANSCRIPT',
        fileSize: 1100000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-01-25T14:10:00Z',
        ocrApplied: false,
        pageCount: 2,
        status: 'COMPLETED',
        extractedText: `UNIVERSIDADE DE SÃO PAULO (USP) - OFFICIAL TRANSCRIPT
Student: Lucas Silva | Program: Information Systems
Cumulative Average: 7.6 / 10.0 (Normalized US GPA: 3.25)
Grade Trajectory Note:
- Semesters 1-4 Average: 6.8 / 10.0
- Semesters 5-8 Average: 8.8 / 10.0 (Strong Upward Trajectory)
Advanced Courses: Distributed Architectures (9.5/10), Cloud Computing (9.0/10), Database Systems (9.0/10).`,
        chunks: [],
      },
      {
        id: 'doc_lucas_resume',
        applicantId: 'app_lucas_silva',
        name: 'Resume_Lucas_Silva.pdf',
        type: 'RESUME',
        fileSize: 510000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-01-25T14:20:00Z',
        ocrApplied: false,
        pageCount: 2,
        status: 'COMPLETED',
        extractedText: `LUCAS SILVA | Senior Backend Software Engineer | São Paulo, Brazil
SUMMARY: 5+ years of enterprise engineering experience designing high-throughput distributed microservices.
EXPERIENCE:
- Senior Software Engineer | Nubank (Fintech) (2022 – Present)
  * Architected payment settlement engine handling 15,000 transactions/sec using Go, Clojure, and Kafka.
  * Reduced cloud infrastructure spending by $420,000 annually via Kubernetes resource autoscaling.
- Software Engineer | Stone Pagamentos (2020 – 2022)
  * Built gRPC microservices and managed PostgreSQL partitioning.
SKILLS: Go, Java, Clojure, Kafka, Kubernetes, AWS, Terraform, Distributed Transactions, gRPC.`,
        chunks: [],
      },
      {
        id: 'doc_lucas_financial',
        applicantId: 'app_lucas_silva',
        name: 'Bank_Statement_Itau_Unibanco.pdf',
        type: 'FINANCIAL',
        fileSize: 720000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-01-25T14:30:00Z',
        ocrApplied: true,
        ocrConfidence: 94,
        pageCount: 1,
        status: 'COMPLETED',
        extractedText: `ITAÚ UNIBANCO S.A. - EXTRATO BANCÁRIO OFICIAL
Account: Lucas Silva | Date: 15 Jan 2026
Available Liquid Balance: BRL 235,000 (Approx. $46,500 USD).
Note: Applicant is actively applying for an international student loan to cover the remaining balance.`,
        chunks: [],
      }
    ],
    academicAnalysis: {
      score: 80,
      rawGPA: '7.6 / 10.0 (Normalized: 3.25/4.0)',
      normalizedGPA: 3.25,
      gradingSystem: '10-Point Scale (USP Brazil)',
      trend: 'UPWARD_TRAJECTORY',
      trendDescription: 'Notable upward trajectory: rose from 6.8/10 in early semesters to 8.8/10 in upper-division systems courses.',
      backlogsOrRetakes: 1,
      backlogDetails: '1 course repeated in freshman calculus, subsequently cleared with grade 8.5.',
      researchCourseworkReadiness: 78,
      subjectBreakdown: [
        { subject: 'Distributed Architectures', grade: '9.5 / 10', normalizedScore: 95, category: 'CORE_CS', isStrength: true },
        { subject: 'Cloud Computing & Infrastructure', grade: '9.0 / 10', normalizedScore: 90, category: 'CORE_CS', isStrength: true },
        { subject: 'Freshman Calculus', grade: '8.5 / 10 (Retake)', normalizedScore: 82, category: 'MATH', isStrength: false },
      ],
      academicConsistency: 'Early grades moderate, but upper-division systems coursework is stellar and directly corroborated by 5 years of senior engineering work.',
      strengths: ['Exceptional upward grade trajectory (8.8/10 in final 2 years)', 'High mastery in distributed systems'],
      weaknesses: ['Lower cumulative GPA (3.25) due to early undergraduate semesters'],
      evidence: []
    },
    sopAnalysis: {
      score: 88,
      motivationStrength: 90,
      writingQuality: 87,
      originalityScore: 90,
      clarityScore: 89,
      careerGoalClarity: 'Aspires to transition from senior engineer to principal distributed systems architect and technical leader.',
      universityFitAnalysis: 'Fits MS in Software Engineering curriculum with focus on cloud-native enterprise platforms.',
      researchInterests: ['Distributed Consensus', 'Fault-Tolerant Microservices', 'Cloud Cost Optimization'],
      crossValidationWithBackground: 'Fully matches 5 years of senior backend engineering at Nubank.',
      strengths: ['Pragmatic industry focus backed by real production scale metrics'],
      weaknesses: [],
      evidence: []
    },
    resumeAnalysis: {
      score: 96,
      technicalSkills: {
        programmingLanguages: ['Go', 'Java', 'Clojure', 'SQL', 'TypeScript'],
        frameworksAndTools: ['Kafka', 'Kubernetes', 'AWS', 'Terraform', 'gRPC', 'PostgreSQL', 'Docker'],
        specializations: ['Distributed Systems', 'Cloud Architecture', 'High-Throughput Payment Engines']
      },
      softSkills: ['Engineering Leadership', 'Technical Mentorship', 'System Design Reviews'],
      projects: [{ title: 'Nubank Real-Time Payment Settlement Engine', description: '15k TPS payment pipeline in Go/Kafka', technologies: ['Go', 'Kafka', 'Kubernetes'], impactOrOutcome: 'Scaled to 15k TPS, $420k annual cloud savings', verifiedInOtherDocs: true }],
      internshipsAndWork: [{ role: 'Senior Software Engineer', company: 'Nubank', duration: '3 Years (2022 - Present)', responsibilities: ['Architected core payment infrastructure'] }],
      publications: [],
      leadershipRoles: ['Nubank Backend Chapter Tech Lead (Mentored 8 junior engineers)'],
      strengths: ['Unmatched production engineering depth handling 15,000 transactions/sec', 'Quantifiable business impact ($420k cloud savings)'],
      weaknesses: ['No formal academic research publications'],
      evidence: []
    },
    recommendationAnalysis: {
      score: 89,
      leadershipRating: 95,
      teamworkRating: 94,
      communicationRating: 92,
      researchPotentialRating: 75,
      recommenders: [{ name: 'Carlos Mendez', designation: 'VP of Engineering', institution: 'Nubank', relationship: 'Direct Engineering Manager', durationKnown: '3 Years', sentiment: 'ENTHUSIASTIC', credibilityRating: 'VERY_HIGH', keyEndorsements: ['Top 5% backend engineers at company'], anecdoteSummary: 'Led incident response during Black Friday peak traffic.' }],
      recommenderConsistency: 'High praise for system design, reliability under pressure, and mentorship.',
      strengths: ['Exceptional industry endorsement from VP of Engineering'],
      weaknessesOrConcerns: [],
      evidence: []
    },
    financialAnalysis: {
      score: 65,
      readinessStatus: 'PARTIAL_GAP',
      estimatedCostOfAttendance1Year: 58500,
      estimatedCostOfAttendance2Year: 117000,
      totalVerifiedLiquidFundsUSD: 46500,
      fundingGapUSD: 12000,
      sourcesOfFunding: [{ sourceType: 'BANK_DEPOSIT', amountUSD: 46500, sponsorRelationship: 'Personal Savings (Itaú Unibanco)', verificationStatus: 'VERIFIED', documentName: 'Bank_Statement_Itau_Unibanco.pdf' }],
      missingFinancialDocuments: ['Loan Sanction Letter or Supplemental Sponsor Affidavit for $12,000 USD'],
      financialReviewRequired: true,
      recommendations: [
        'Applicant has verified $46,500 USD liquid assets against Year-1 COA of $58,500 USD (Deficit: $12,000 USD).',
        'Issue Conditional Admission pending submission of supplemental sponsor affidavit or loan sanction letter.'
      ],
      evidence: []
    },
    riskAnalysis: {
      overallRiskLevel: 'MEDIUM',
      riskScore: 75,
      flaggedRisks: [
        {
          id: 'risk_lucas_fin',
          severity: 'MEDIUM',
          category: 'DISCREPANCY',
          title: 'First-Year Financial Funding Gap ($12,000 USD)',
          description: 'Applicant currently demonstrates $46,500 USD liquid funds vs $58,500 USD Year-1 requirement.',
          involvedDocuments: ['Bank_Statement_Itau_Unibanco.pdf'],
          suggestedAction: 'Require supplemental financial guarantee before I-20 generation.'
        }
      ],
      missingMandatoryDocuments: [],
      inconsistencyAudit: 'Professional credentials and transcripts are fully verified. Sole flag is the $12k financial funding gap.',
      evidence: []
    },
    reasoningResult: {
      overallRecommendation: 'FINANCIAL_REVIEW_REQUIRED',
      confidenceScore: 88,
      executiveSummary: 'Lucas Silva is an outstanding professional candidate with 5 years of senior engineering experience at Nubank. While undergraduate GPA is moderate (3.25/4.0), his final 2-year upward trend (3.75) and enterprise engineering track record are exceptional. Conditionally admit pending resolution of the $12,000 USD financial shortfall.',
      comprehensiveProfileSummary: 'Lucas brings real-world enterprise engineering expertise that will enrich graduate seminar discussions. His technical acumen in distributed systems is proven at high scale. The sole operational barrier is verified funding for the remaining $12,000 USD of Year-1 COA.',
      crossDocumentSynergyAnalysis: 'High synergy between senior systems work at Nubank and upper-division transcript performance.',
      coreStrengths: [
        { title: 'Proven Enterprise Scale Engineering', description: 'Architected payment engines handling 15k TPS at Nubank.', supportingAgents: ['Resume Intelligence'], evidence: { id: 'ev_lucas_1', documentId: 'doc_lucas_resume', documentName: 'Resume_Lucas_Silva.pdf', documentType: 'RESUME', snippet: 'Architected payment settlement engine handling 15,000 transactions/sec using Go, Clojure, and Kafka.' } },
        { title: 'Strong Upward Academic Trajectory', description: 'Rose to 8.8/10 (3.75) in upper-division systems coursework.', supportingAgents: ['Academic Intelligence'], evidence: { id: 'ev_lucas_2', documentId: 'doc_lucas_transcript', documentName: 'University_of_Sao_Paulo_Transcript.pdf', documentType: 'TRANSCRIPT', snippet: 'Semesters 5-8 Average: 8.8 / 10.0 (Strong Upward Trajectory).' } }
      ],
      coreWeaknesses: [
        { title: 'Year-1 Funding Shortfall ($12,000 USD)', description: 'Verified liquid assets ($46,500) fall short of $58,500 requirement.', mitigatingFactors: 'Applicant is gainfully employed and actively applying for international graduate student loan.', evidence: { id: 'ev_lucas_weak_1', documentId: 'doc_lucas_financial', documentName: 'Bank_Statement_Itau_Unibanco.pdf', documentType: 'FINANCIAL', snippet: 'Available Liquid Balance: BRL 235,000 (Approx. $46,500 USD).' } }
      ],
      tailoredInterviewQuestions: [
        { category: 'TECHNICAL', question: 'How did you ensure transactional idempotency across Kafka consumers in your Nubank payment settlement engine?', rationale: 'Tests distributed systems design depth.', targetToProbe: 'Distributed consensus mechanisms.' },
        { category: 'GAP_VERIFICATION', question: 'What is your current timeline for securing the remaining $12,000 USD loan sanction or sponsor guarantee?', rationale: 'Resolves I-20 compliance.', targetToProbe: 'Financial readiness.' }
      ],
      admissionCommitteeTalkingPoints: [
        'Admit conditionally for MS in Software Engineering.',
        'Withhold official I-20 visa document until supplemental $12,000 financial guarantee is uploaded.',
        'High likelihood of peer leadership and industrial teaching contribution.'
      ]
    }
  },

  // ----------------------------------------------------
  // 4. FATIMA AL-HASSAN (UAE -> MS in Cybersecurity)
  // ----------------------------------------------------
  {
    id: 'app_fatima_alhassan',
    applicationNumber: 'ADM-2026-9041',
    firstName: 'Fatima',
    lastName: 'Al-Hassan',
    email: 'f.alhassan@alumni.ku.ac.ae',
    countryOfOrigin: 'United Arab Emirates',
    nationality: 'Emirati',
    passportNumber: 'N4109823',
    targetProgram: 'MS in Cybersecurity & Privacy',
    targetSpecialization: 'Network Security & Applied Cryptography',
    targetTerm: 'Fall 2026',
    targetDegreeLevel: 'MASTER',
    appliedDate: '2026-01-28',
    status: 'REVIEW_COMPLETED',
    undergraduateInstitution: 'Khalifa University of Science and Technology',
    undergraduateMajor: 'Computer Engineering (Cybersecurity Track)',
    rawGPA: '3.92 / 4.00 (Class Rank: 2 of 96)',
    normalizedGPA: 3.92,
    englishProficiencyType: 'IELTS',
    englishOverallScore: 8.0,
    englishSubScores: {
      reading: 8.5,
      listening: 8.5,
      speaking: 8.0,
      writing: 7.5,
    },
    tags: ['Full Govt Scholarship', 'ACM Publication', 'Top 2%', 'OSCP Certified'],
    isFavorite: true,
    lastAnalyzedAt: '2026-02-17T09:30:00Z',
    documents: [
      {
        id: 'doc_fatima_transcript',
        applicantId: 'app_fatima_alhassan',
        name: 'Khalifa_University_Official_Transcript.pdf',
        type: 'TRANSCRIPT',
        fileSize: 1350000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-01-28T10:00:00Z',
        ocrApplied: false,
        pageCount: 2,
        status: 'COMPLETED',
        extractedText: `KHALIFA UNIVERSITY OF SCIENCE AND TECHNOLOGY
OFFICIAL TRANSCRIPT OF ACADEMIC RECORD
Student: Fatima Al-Hassan | Degree: B.Sc. in Computer Engineering (Cybersecurity Concentration)
Cumulative GPA: 3.92 / 4.00 | Honors: Summa Cum Laude
Key Coursework: Cryptography & Network Security (A+), Reverse Engineering & Malware Analysis (A), Secure Software Design (A), Operating Systems Kernel Security (A+), Discrete Mathematics (A).`,
        chunks: [],
      },
      {
        id: 'doc_fatima_financial',
        applicantId: 'app_fatima_alhassan',
        name: 'UAE_Ministry_of_Education_Scholarship_Guarantee.pdf',
        type: 'FINANCIAL',
        fileSize: 920000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-01-28T10:15:00Z',
        ocrApplied: true,
        ocrConfidence: 99,
        pageCount: 1,
        status: 'COMPLETED',
        extractedText: `UNITED ARAB EMIRATES MINISTRY OF EDUCATION - SCHOLARSHIP DIVISION
OFFICIAL FINANCIAL SPONSORSHIP GUARANTEE LETTER
To: Graduate Admissions Office
This is to certify that Ms. Fatima Al-Hassan has been awarded a Full National Postgraduate Scholarship (Ref: MOE/SCH/2026/0491).
Coverage: 100% of all tuition fees, health insurance, annual book allowance, plus a monthly living stipend of $3,200 USD for the full 2-year duration of her Master's degree (Estimated Total Value: $120,000 USD).
All disbursements are guaranteed directly by the UAE Government.`,
        chunks: [],
      }
    ],
    academicAnalysis: {
      score: 97,
      rawGPA: '3.92 / 4.00',
      normalizedGPA: 3.92,
      gradingSystem: '4.00 Scale (Khalifa University)',
      trend: 'CONSISTENTLY_HIGH',
      trendDescription: 'Flawless academic performance with straight A/A+ grades in all cybersecurity and cryptographic coursework.',
      backlogsOrRetakes: 0,
      researchCourseworkReadiness: 98,
      subjectBreakdown: [
        { subject: 'Cryptography & Network Security', grade: 'A+', normalizedScore: 100, category: 'CORE_CS', isStrength: true },
        { subject: 'Reverse Engineering & Malware Analysis', grade: 'A', normalizedScore: 95, category: 'CORE_CS', isStrength: true },
        { subject: 'Operating Systems Kernel Security', grade: 'A+', normalizedScore: 98, category: 'CORE_CS', isStrength: true },
      ],
      academicConsistency: 'High consistency between Khalifa University transcript, IELTS 8.0, and offensive security certifications.',
      strengths: ['Summa Cum Laude standing (3.92/4.00)', 'Class rank 2 of 96 students', 'OSCP security certification'],
      weaknesses: [],
      evidence: []
    },
    sopAnalysis: {
      score: 94,
      motivationStrength: 95,
      writingQuality: 93,
      originalityScore: 94,
      clarityScore: 95,
      careerGoalClarity: 'Aims to conduct post-quantum cryptographic protocol research and return to UAE National Cyber Security Council.',
      universityFitAnalysis: 'Directly aligns with faculty cryptography lab and National Science Foundation cybersecurity research center.',
      researchInterests: ['Post-Quantum Cryptography', 'Zero-Knowledge Proofs', 'Hardware Security Enclaves'],
      crossValidationWithBackground: 'Fully verified against undergraduate thesis and ACM CCS workshop paper.',
      strengths: ['Clear long-term national service and research trajectory'],
      weaknesses: [],
      evidence: []
    },
    resumeAnalysis: {
      score: 95,
      technicalSkills: {
        programmingLanguages: ['C', 'Rust', 'Python', 'x86/ARM Assembly', 'Go'],
        frameworksAndTools: ['Ghidra', 'IDA Pro', 'Wireshark', 'QEMU', 'Docker', 'Linux Kernel'],
        specializations: ['Binary Exploitation', 'Applied Cryptography', 'Zero-Knowledge Systems']
      },
      softSkills: ['Technical Writing', 'Ethics & Compliance', 'Team CTF Captain'],
      projects: [{ title: 'Post-Quantum Lattice-Based Key Exchange Benchmark', description: 'Benchmarked Kyber implementations on ARM embedded devices', technologies: ['Rust', 'C', 'ARM'], impactOrOutcome: 'Accepted at ACM CCS Workshop 2025', verifiedInOtherDocs: true }],
      internshipsAndWork: [{ role: 'Cybersecurity Research Intern', company: 'Center for Cyber-Physical Systems', duration: '8 Months', responsibilities: ['Vulnerability research in IoT firmware'] }],
      publications: [{ title: 'Benchmarking Lattice Cryptography on Constrained IoT Enclaves', venueOrConference: 'ACM CCS Workshop', year: '2025', status: 'PUBLISHED' }],
      leadershipRoles: ['Captain, Khalifa University Ethical Hacking CTF Team (National Champions)'],
      strengths: ['Offensive Security Certified Professional (OSCP)', 'ACM CCS workshop publication'],
      weaknesses: [],
      evidence: []
    },
    recommendationAnalysis: {
      score: 95,
      leadershipRating: 94,
      teamworkRating: 93,
      communicationRating: 95,
      researchPotentialRating: 97,
      recommenders: [{ name: 'Dr. Tariq Mansoor', designation: 'Director of Cryptography Lab', institution: 'Khalifa University', relationship: 'Thesis Advisor', durationKnown: '3 Years', sentiment: 'ENTHUSIASTIC', credibilityRating: 'VERY_HIGH', keyEndorsements: ['Top 1% cybersecurity student in 10 years'], anecdoteSummary: 'Discovered zero-day vulnerability in legacy firmware library.' }],
      recommenderConsistency: 'Consistently praised for exceptional ethical discipline and technical depth.',
      strengths: ['Unanimously outstanding faculty recommendation'],
      weaknessesOrConcerns: [],
      evidence: []
    },
    financialAnalysis: {
      score: 100,
      readinessStatus: 'FULLY_FUNDED',
      estimatedCostOfAttendance1Year: 58500,
      estimatedCostOfAttendance2Year: 117000,
      totalVerifiedLiquidFundsUSD: 120000,
      fundingGapUSD: 0,
      sourcesOfFunding: [{ sourceType: 'SCHOLARSHIP', amountUSD: 120000, sponsorRelationship: 'UAE Ministry of Education Full Postgraduate Fellowship', verificationStatus: 'VERIFIED', documentName: 'UAE_Ministry_of_Education_Scholarship_Guarantee.pdf' }],
      missingFinancialDocuments: [],
      financialReviewRequired: false,
      recommendations: ['100% full government sponsorship ($120,000 total commitment). Zero financial risk.'],
      evidence: []
    },
    riskAnalysis: {
      overallRiskLevel: 'LOW',
      riskScore: 99,
      flaggedRisks: [],
      missingMandatoryDocuments: [],
      inconsistencyAudit: 'Clean, verified international dossier.',
      evidence: []
    },
    reasoningResult: {
      overallRecommendation: 'STRONGLY_RECOMMEND_ADMIT',
      confidenceScore: 97,
      executiveSummary: 'Fatima Al-Hassan is a stellar international applicant with a 3.92 GPA, ACM workshop paper, OSCP certification, and 100% full government sponsorship ($120,000 USD guarantee). Unanimous admit.',
      comprehensiveProfileSummary: 'Fatima is a top-tier candidate in cybersecurity. Her hands-on binary exploitation and applied cryptography background is exceptional. Full government backing guarantees seamless enrollment.',
      crossDocumentSynergyAnalysis: 'Flawless synergy across transcript, research publication, and official scholarship sponsorship.',
      coreStrengths: [
        { title: 'Academic Summa Cum Laude & Class Rank 2', description: '3.92/4.00 GPA with perfect grades in advanced cryptography.', supportingAgents: ['Academic Intelligence'], evidence: { id: 'ev_fatima_1', documentId: 'doc_fatima_transcript', documentName: 'Khalifa_University_Official_Transcript.pdf', documentType: 'TRANSCRIPT', snippet: 'Cumulative GPA: 3.92 / 4.00 | Honors: Summa Cum Laude.' } },
        { title: 'Full Government Sponsorship ($120,000 USD)', description: '100% guaranteed tuition + $3,200 monthly living stipend.', supportingAgents: ['Financial Intelligence'], evidence: { id: 'ev_fatima_2', documentId: 'doc_fatima_financial', documentName: 'UAE_Ministry_of_Education_Scholarship_Guarantee.pdf', documentType: 'FINANCIAL', snippet: 'Coverage: 100% of all tuition fees, health insurance, plus monthly living stipend of $3,200 USD.' } }
      ],
      coreWeaknesses: [],
      tailoredInterviewQuestions: [
        { category: 'TECHNICAL', question: 'How did you protect against side-channel timing leaks in your post-quantum lattice key exchange benchmark on ARM chips?', rationale: 'Assesses cryptographic implementation depth.', targetToProbe: 'Constant-time programming techniques.' }
      ],
      admissionCommitteeTalkingPoints: ['Immediate admit offer.', 'Fast-track I-20 issuance with government scholarship document.']
    }
  }
];

// Pre-compute vector chunks and knowledge graphs for all initial applicants
export function getEnrichedInitialApplicants(): Applicant[] {
  return INITIAL_APPLICANTS.map(app => {
    const enrichedDocs = app.documents.map(doc => {
      if (!doc.chunks || doc.chunks.length === 0) {
        doc.chunks = chunkDocumentText(doc.id, doc.type, doc.name, doc.extractedText);
      }
      return doc;
    });

    const enrichedApp = {
      ...app,
      documents: enrichedDocs,
    };

    if (!enrichedApp.knowledgeGraph) {
      enrichedApp.knowledgeGraph = buildApplicantKnowledgeGraph(enrichedApp);
    }

    return enrichedApp;
  });
}
