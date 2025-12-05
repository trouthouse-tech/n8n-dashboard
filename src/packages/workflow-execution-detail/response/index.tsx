'use client';

interface ResponseViewerProps {
  raw: string;
}

export const ResponseViewer = ({ raw }: ResponseViewerProps) => {
  const parsedResponse = parseResponse(raw);

  if (parsedResponse !== null) {
    return (
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Response</h2>
        <div className={styles.responseContainer}>
          <ResponseTree data={parsedResponse} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Response (Raw)</h2>
      <pre className={styles.rawResponse}>{raw}</pre>
    </div>
  );
};

const parseResponse = (raw: string): unknown | null => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

interface ResponseTreeProps {
  data: unknown;
  depth?: number;
}

const ResponseTree = ({ data, depth = 0 }: ResponseTreeProps) => {
  if (data === null) {
    return <span className={styles.valueNull}>null</span>;
  }

  if (typeof data === 'boolean') {
    return <span className={styles.valueBoolean}>{data.toString()}</span>;
  }

  if (typeof data === 'number') {
    return <span className={styles.valueNumber}>{data}</span>;
  }

  if (typeof data === 'string') {
    if (data.length > 200) {
      return (
        <div className={styles.valueLongString}>
          <span className={styles.valueString}>{data}</span>
        </div>
      );
    }
    return <span className={styles.valueString}>&quot;{data}&quot;</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className={styles.valueEmpty}>[]</span>;
    }
    return (
      <div className={styles.arrayContainer}>
        <span className={styles.bracket}>[</span>
        <div className={styles.arrayItems}>
          {data.map((item, index) => (
            <div key={index} className={styles.arrayItem}>
              <span className={styles.arrayIndex}>{index}</span>
              <ResponseTree data={item} depth={depth + 1} />
            </div>
          ))}
        </div>
        <span className={styles.bracket}>]</span>
      </div>
    );
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) {
      return <span className={styles.valueEmpty}>{'{}'}</span>;
    }
    return (
      <div className={styles.objectContainer}>
        {entries.map(([key, value]) => (
          <div key={key} className={styles.objectProperty}>
            <span className={styles.propertyKey}>{key}</span>
            <div className={styles.propertyValue}>
              <ResponseTree data={value} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span className={styles.valueUnknown}>{String(data)}</span>;
};

const styles = {
  container: `
    bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3
  `,
  sectionTitle: `
    text-sm font-medium text-gray-600 uppercase tracking-wider
  `,
  responseContainer: `
    bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto max-h-[70vh] overflow-y-auto
  `,
  rawResponse: `
    text-gray-700 text-sm font-mono whitespace-pre-wrap
  `,
  // Tree styles
  objectContainer: `
    flex flex-col gap-2
  `,
  objectProperty: `
    grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-start
  `,
  propertyKey: `
    text-blue-600 font-mono text-sm font-medium whitespace-nowrap
  `,
  propertyValue: `
    min-w-0
  `,
  arrayContainer: `
    flex flex-col gap-2
  `,
  bracket: `
    text-gray-400 font-mono text-sm
  `,
  arrayItems: `
    pl-4 border-l-2 border-gray-200 flex flex-col gap-2 ml-2
  `,
  arrayItem: `
    flex items-start gap-2
  `,
  arrayIndex: `
    text-gray-400 font-mono text-xs min-w-[20px] bg-gray-100 px-1 py-0.5 rounded
  `,
  valueString: `
    text-green-600 font-mono text-sm break-all
  `,
  valueLongString: `
    bg-gray-100 rounded-lg p-3 max-h-48 overflow-y-auto w-full
  `,
  valueNumber: `
    text-orange-600 font-mono text-sm
  `,
  valueBoolean: `
    text-purple-600 font-mono text-sm
  `,
  valueNull: `
    text-gray-400 font-mono text-sm italic
  `,
  valueEmpty: `
    text-gray-400 font-mono text-sm
  `,
  valueUnknown: `
    text-gray-500 font-mono text-sm
  `,
};

