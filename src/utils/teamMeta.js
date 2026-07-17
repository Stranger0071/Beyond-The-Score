const TEAM_COLORS = {
  'Chennai Super Kings': '#FDB913',
  'Delhi Daredevils': '#0078BC',
  'Delhi Capitals': '#0078BC',
  'Kings XI Punjab': '#ED1B24',
  'Punjab Kings': '#ED1B24',
  'Kolkata Knight Riders': '#3A225D',
  'Mumbai Indians': '#004BA0',
  'Rajasthan Royals': '#254AA5',
  'Royal Challengers Bangalore': '#EC1C24',
  'Sunrisers Hyderabad': '#F77207',
  'Gujarat Lions': '#E15454',
  'Gujarat Titans': '#1C2C5C',
  'Rising Pune Supergiant': '#697E97',
  'Rising Pune Supergiants': '#697E97',
  'Lucknow Super Giants': '#A72056',
}

const TEAM_SHORT = {
  'Chennai Super Kings': 'CSK',
  'Delhi Daredevils': 'DD',
  'Delhi Capitals': 'DC',
  'Kings XI Punjab': 'KXIP',
  'Punjab Kings': 'PBKS',
  'Kolkata Knight Riders': 'KKR',
  'Mumbai Indians': 'MI',
  'Rajasthan Royals': 'RR',
  'Royal Challengers Bangalore': 'RCB',
  'Sunrisers Hyderabad': 'SRH',
  'Gujarat Lions': 'GL',
  'Gujarat Titans': 'GT',
  'Rising Pune Supergiant': 'RPS',
  'Rising Pune Supergiants': 'RPS',
  'Lucknow Super Giants': 'LSG',
}

export function getTeamMeta(name) {
  const short =
    TEAM_SHORT[name] ??
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase()

  return {
    name,
    short,
    color: TEAM_COLORS[name] ?? '#475569',
  }
}
