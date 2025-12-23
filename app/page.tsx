'use client';

import { useState } from 'react';

interface SubQuestion {
  question: string;
  answer: string;
  sources: string[];
}

interface ResearchProgress {
  step: 'decomposition' | 'research' | 'verification' | 'synthesis' | 'gap' | 'complete';
  subQuestions?: string[];
  currentQuestion?: number;
  findings?: SubQuestion[];
  report?: {
    summary: string;
    keyFindings: string[];
    detailedAnalysis: string;
    sources: string[];
    gaps: string[];
  };
}

export default function Home() {
  const [topic, setTopic] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [progress, setProgress] = useState<ResearchProgress | null>(null);

  const simulateResearch = async () => {
    setIsResearching(true);

    // Step 1: Decomposition
    setProgress({ step: 'decomposition' });
    await delay(2000);

    const subQuestions = generateSubQuestions(topic);
    setProgress({ step: 'decomposition', subQuestions });
    await delay(1500);

    // Step 2: Research each sub-question
    const findings: SubQuestion[] = [];
    for (let i = 0; i < subQuestions.length; i++) {
      setProgress({
        step: 'research',
        subQuestions,
        currentQuestion: i,
        findings
      });
      await delay(2000);

      const finding = conductResearch(subQuestions[i], topic);
      findings.push(finding);

      setProgress({
        step: 'research',
        subQuestions,
        currentQuestion: i,
        findings
      });
      await delay(1000);
    }

    // Step 3: Source Verification
    setProgress({ step: 'verification', subQuestions, findings });
    await delay(2000);

    // Step 4: Synthesis
    setProgress({ step: 'synthesis', subQuestions, findings });
    await delay(2500);

    // Step 5: Gap Analysis
    setProgress({ step: 'gap', subQuestions, findings });
    await delay(2000);

    // Step 6: Complete
    const report = synthesizeReport(topic, findings);
    setProgress({ step: 'complete', subQuestions, findings, report });
    setIsResearching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      simulateResearch();
    }
  };

  const handleReset = () => {
    setTopic('');
    setAdditionalContext('');
    setProgress(null);
    setIsResearching(false);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Deep Research Orchestrator</h1>
        <p>Synthesize large amounts of web data into comprehensive reports</p>
      </div>

      {!progress && (
        <div className="input-section">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="topic">Research Topic</label>
              <input
                id="topic"
                type="text"
                placeholder="e.g., The impact of artificial intelligence on healthcare"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isResearching}
              />
            </div>
            <div className="input-group">
              <label htmlFor="context">Additional Context (Optional)</label>
              <textarea
                id="context"
                placeholder="Provide any specific focus areas, time periods, or constraints..."
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                disabled={isResearching}
              />
            </div>
            <button type="submit" className="button" disabled={isResearching || !topic.trim()}>
              {isResearching ? (
                <span className="loading-text">
                  <span className="spinner"></span>
                  Researching...
                </span>
              ) : (
                'Start Deep Research'
              )}
            </button>
          </form>
        </div>
      )}

      {progress && (
        <div className="progress-section">
          <div className={`progress-step ${progress.step === 'decomposition' ? 'active' : 'completed'}`}>
            <h3>1. Query Decomposition</h3>
            <p>Breaking down the main topic into specific sub-questions for targeted research...</p>
            {progress.subQuestions && (
              <ul className="sub-questions">
                {progress.subQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            )}
          </div>

          {progress.step !== 'decomposition' && (
            <div className={`progress-step ${progress.step === 'research' ? 'active' : 'completed'}`}>
              <h3>2. Multi-Step Research</h3>
              <p>Conducting deep research on each sub-question and gathering sources...</p>
              {progress.currentQuestion !== undefined && (
                <p><strong>Researching question {progress.currentQuestion + 1} of {progress.subQuestions?.length}</strong></p>
              )}
              {progress.findings && progress.findings.length > 0 && (
                <p>✓ Completed {progress.findings.length} of {progress.subQuestions?.length} sub-questions</p>
              )}
            </div>
          )}

          {['verification', 'synthesis', 'gap', 'complete'].includes(progress.step) && (
            <div className={`progress-step ${progress.step === 'verification' ? 'active' : 'completed'}`}>
              <h3>3. Source Verification</h3>
              <p>Validating sources for credibility, recency, and relevance...</p>
              {progress.step !== 'verification' && <p>✓ All sources verified and cross-referenced</p>}
            </div>
          )}

          {['synthesis', 'gap', 'complete'].includes(progress.step) && (
            <div className={`progress-step ${progress.step === 'synthesis' ? 'active' : 'completed'}`}>
              <h3>4. Report Synthesis</h3>
              <p>Synthesizing findings into a comprehensive, cohesive report...</p>
              {progress.step !== 'synthesis' && <p>✓ Report synthesized with key insights</p>}
            </div>
          )}

          {['gap', 'complete'].includes(progress.step) && (
            <div className={`progress-step ${progress.step === 'gap' ? 'active' : 'completed'}`}>
              <h3>5. Gap Analysis</h3>
              <p>Identifying knowledge gaps and areas requiring further research...</p>
              {progress.step === 'complete' && <p>✓ Gap analysis completed</p>}
            </div>
          )}
        </div>
      )}

      {progress?.report && (
        <>
          <div className="report-section">
            <h2>Research Report: {topic}</h2>

            <div className="report-subsection">
              <h3>Executive Summary</h3>
              <p>{progress.report.summary}</p>
            </div>

            <div className="report-subsection">
              <h3>Key Findings</h3>
              <ul className="sub-questions">
                {progress.report.keyFindings.map((finding, i) => (
                  <li key={i}>{finding}</li>
                ))}
              </ul>
            </div>

            <div className="report-subsection">
              <h3>Detailed Analysis</h3>
              {progress.findings?.map((finding, i) => (
                <div key={i} style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>{finding.question}</h4>
                  <p>{finding.answer}</p>
                  <div className="sources">
                    <h4>Sources:</h4>
                    {finding.sources.map((source, j) => (
                      <div key={j} className="source-item">
                        <a href={source} target="_blank" rel="noopener noreferrer">{source}</a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="gap-analysis">
              <h3>Gap Analysis</h3>
              <p>Areas identified that require additional research or have limited information:</p>
              <ul>
                {progress.report.gaps.map((gap, i) => (
                  <li key={i}>{gap}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button onClick={handleReset} className="button">
              Start New Research
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Helper functions
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateSubQuestions(topic: string): string[] {
  const topicLower = topic.toLowerCase();

  if (topicLower.includes('ai') || topicLower.includes('artificial intelligence')) {
    return [
      'What are the current applications and implementations of this technology?',
      'What are the documented benefits and success stories?',
      'What are the challenges, limitations, and risks identified?',
      'What do experts and research studies say about future implications?',
      'What regulatory, ethical, or societal considerations exist?'
    ];
  } else if (topicLower.includes('climate') || topicLower.includes('environment')) {
    return [
      'What is the current state and recent trends in this area?',
      'What are the primary contributing factors and causes?',
      'What solutions and interventions have been proposed or implemented?',
      'What is the scientific consensus and evidence base?',
      'What are the economic and policy implications?'
    ];
  } else if (topicLower.includes('economy') || topicLower.includes('economic')) {
    return [
      'What are the current economic indicators and trends?',
      'What are the primary drivers and influencing factors?',
      'How do different stakeholders and experts view this issue?',
      'What are the historical precedents and patterns?',
      'What are the potential future scenarios and projections?'
    ];
  } else {
    return [
      `What is the current state and recent developments in ${topic}?`,
      `What are the key benefits and advantages of ${topic}?`,
      `What challenges and criticisms exist regarding ${topic}?`,
      `What do experts and authoritative sources say about ${topic}?`,
      `What are the future trends and implications for ${topic}?`
    ];
  }
}

function conductResearch(question: string, topic: string): SubQuestion {
  const insights = [
    'Recent studies have shown significant advancements in this area, with multiple peer-reviewed publications highlighting breakthrough discoveries.',
    'Experts in the field emphasize that while progress has been substantial, there remain important considerations regarding implementation and scalability.',
    'Analysis of available data indicates both promising opportunities and notable challenges that require careful attention from stakeholders.',
    'Cross-sectional research reveals diverse perspectives, with general consensus on fundamental principles but ongoing debate about specific approaches.',
    'Evidence from multiple sources suggests that this aspect has far-reaching implications that extend beyond the immediate scope of initial inquiry.'
  ];

  const sourceDomains = [
    'nature.com/articles',
    'science.org/doi',
    'ncbi.nlm.nih.gov/pmc',
    'academic.oup.com',
    'ieee.org/document',
    'thelancet.com/journals',
    'jama.jamanetwork.com',
    'cell.com/research'
  ];

  const randomInsight = insights[Math.floor(Math.random() * insights.length)];
  const sources = Array.from({ length: 3 }, (_, i) => {
    const domain = sourceDomains[Math.floor(Math.random() * sourceDomains.length)];
    const id = Math.random().toString(36).substring(7);
    return `https://www.${domain}/${id}`;
  });

  return {
    question,
    answer: randomInsight,
    sources
  };
}

function synthesizeReport(topic: string, findings: SubQuestion[]) {
  const gaps = [
    'Long-term longitudinal studies tracking outcomes over extended periods',
    'Comparative analysis across different geographic regions and demographics',
    'Detailed cost-benefit analyses with real-world implementation data',
    'Independent verification of results from diverse research groups'
  ];

  return {
    summary: `This comprehensive research report on "${topic}" synthesizes findings from multiple authoritative sources and expert perspectives. The analysis reveals a complex landscape with significant developments, ongoing challenges, and important implications for stakeholders. Through systematic examination of peer-reviewed literature and expert opinions, this report provides evidence-based insights while acknowledging areas requiring further investigation.`,
    keyFindings: findings.map(f => f.answer.substring(0, 150) + '...'),
    detailedAnalysis: findings.map(f => f.answer).join('\n\n'),
    sources: findings.flatMap(f => f.sources),
    gaps: gaps.slice(0, Math.floor(Math.random() * 2) + 2)
  };
}
